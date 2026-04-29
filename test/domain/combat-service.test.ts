import { describe, test, expect, beforeEach, vi, type Mock } from 'vitest';
import { randomUUID } from 'crypto';
import { CombatService } from '../../src/domain/combat-service.js';
import { DamageCalculatorService } from '../../src/domain/damage-calculator-service.js';
import { DiceThrower } from '../../src/domain/dice-thrower.js';
import { HealService } from '../../src/domain/heal-service.js';
import { Adventurer } from '../../src/domain/adventurer.js';
import { Monster } from '../../src/domain/monster.js';
import { Weapon } from '../../src/domain/weapon.js';
import { IllegalPotionUsageException } from '../../src/domain/exception/illegal-potion-usage-exception.js';

describe('CombatServiceTest', () => {

    let diceThrower: { rollToHit: Mock };
    let damageCalculatorService: { getDamage: Mock };
    let healService: { heal: Mock };
    let combatService: CombatService;

    beforeEach(() => {
        diceThrower = { rollToHit: vi.fn() };
        damageCalculatorService = { getDamage: vi.fn().mockReturnValue(1) };
        healService = { heal: vi.fn() };
        combatService = new CombatService(
            diceThrower as unknown as DiceThrower,
            damageCalculatorService as unknown as DamageCalculatorService,
            healService as unknown as HealService,
        );
    });

    test('adventurerAndMonsterCanMissAndNothingHappens', () => {
        const gimli: Adventurer = {
            id: null, name: "Gimli", weapons: [Weapon.AXE],
            hp: 20, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        };
        const goblin = goblinMonster();
        diceThrower.rollToHit.mockReturnValueOnce(false).mockReturnValueOnce(false);

        const result = combatService.handleAttack(gimli, goblin);

        expect(result.actions).toHaveLength(2);
        expect(result.actions[0]).toBe("Gimli attacks... But misses!");
        expect(result.actions[1]).toBe("Goblin attacks... But misses!");
        expect(result.updatedAdventurer).toEqual(gimli);
        expect(result.updatedMonster).toEqual(goblin);
    });

    test('adventurerCanAttackAMonsterWithFists', () => {
        const gimli: Adventurer = {
            id: null, name: "Gimli", weapons: [],
            hp: 20, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        };
        const goblin = goblinMonster();
        diceThrower.rollToHit.mockReturnValueOnce(true).mockReturnValueOnce(false);

        const result = combatService.handleAttack(gimli, goblin);

        expect(result.actions).toHaveLength(2);
        expect(result.actions[0]).toBe("Gimli attacks... And hit for 1 damage!");
        expect(result.actions[1]).toBe("Goblin attacks... But misses!");
        expect(result.updatedAdventurer).toEqual(gimli);
        expect(result.updatedMonster).toEqual({
            name: "Goblin", hp: 1, attack: 5, defense: 7,
        });
    });

    test('adventurerCanAttackWithADagger', () => {
        const combatServiceWithRealDamage = new CombatService(
            diceThrower as unknown as DiceThrower,
            new DamageCalculatorService(),
            new HealService(),
        );
        const gimli: Adventurer = {
            id: null, name: "Gimli", weapons: [Weapon.DAGGER],
            hp: 20, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        };
        const goblin: Monster = { name: "Goblin", hp: 10, attack: 3, defense: 3 };
        diceThrower.rollToHit.mockReturnValueOnce(true).mockReturnValueOnce(false);

        const result = combatServiceWithRealDamage.handleAttack(gimli, goblin);

        // real damage: Math.max(5 + 2 - 3, 0) = 4
        expect(result.actions).toHaveLength(2);
        expect(result.actions[0]).toBe("Gimli attacks... And hit for 4 damage!");
        expect(result.actions[1]).toBe("Goblin attacks... But misses!");
        expect(result.updatedAdventurer).toEqual(gimli);
        expect(result.updatedMonster).toEqual({ name: "Goblin", hp: 6, attack: 3, defense: 3 });
    });

    test('adventurerCanHitTheMonsterAndBeMissed', () => {
        const gimli = gimliAdventurer();
        const goblin = goblinMonster();
        diceThrower.rollToHit.mockReturnValueOnce(true).mockReturnValueOnce(false);

        const result = combatService.handleAttack(gimli, goblin);

        expect(result.actions).toHaveLength(2);
        expect(result.actions[0]).toBe("Gimli attacks... And hit for 1 damage!");
        expect(result.actions[1]).toBe("Goblin attacks... But misses!");
        expect(result.updatedAdventurer).toEqual(gimli);
        expect(result.updatedMonster).toEqual({
            name: "Goblin", hp: 1, attack: 5, defense: 7,
        });
    });

    test('bothAdventurerAndMonsterCanHit', () => {
        const gimli: Adventurer = {
            id: null, name: "Gimli", weapons: [],
            hp: 20, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        };
        const goblin = goblinMonster();
        diceThrower.rollToHit.mockReturnValueOnce(true).mockReturnValueOnce(true);

        const result = combatService.handleAttack(gimli, goblin);

        expect(result.actions).toHaveLength(2);
        expect(result.actions[0]).toBe("Gimli attacks... And hit for 1 damage!");
        expect(result.actions[1]).toBe("Goblin attacks... And hit for 1 damage!");
        expect(result.updatedAdventurer).toEqual({
            id: null, name: "Gimli", weapons: [],
            hp: 19, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        });
        expect(result.updatedMonster).toEqual({
            name: "Goblin", hp: 1, attack: 5, defense: 7,
        });
    });

    test('aMonsterDieWhenReaching0HP', () => {
        const gimli = gimliAdventurer();
        diceThrower.rollToHit.mockReturnValueOnce(true).mockReturnValueOnce(false);

        const result = combatService.handleAttack(gimli, {
            name: "Goblin", hp: 1, attack: 5, defense: 7,
        });

        expect(result.actions).toHaveLength(2);
        expect(result.actions[0]).toBe("Gimli attacks... And hit for 1 damage!");
        expect(result.actions[1]).toBe("Goblin is dead!");
        expect(result.updatedAdventurer).toEqual(gimli);
        expect(result.updatedMonster).toEqual({
            name: "Goblin", hp: 0, attack: 5, defense: 7,
        });
    });

    test('adventurerCanDie', () => {
        const gimli: Adventurer = {
            id: null, name: "Gimli", weapons: [Weapon.AXE],
            hp: 1, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        };
        const goblin = goblinMonster();
        diceThrower.rollToHit.mockReturnValueOnce(true).mockReturnValueOnce(true);

        const result = combatService.handleAttack(gimli, goblin);

        expect(result.actions).toHaveLength(3);
        expect(result.actions[0]).toBe("Gimli attacks... And hit for 1 damage!");
        expect(result.actions[1]).toBe("Goblin attacks... And hit for 1 damage!");
        expect(result.actions[2]).toBe("Gimli is dead!");
        expect(result.updatedAdventurer).toEqual({
            id: null, name: "Gimli", weapons: [Weapon.AXE],
            hp: 0, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        });
        expect(result.updatedMonster).toEqual({
            name: "Goblin", hp: 1, attack: 5, defense: 7,
        });
    });

    test('adventurerCanHealThemself', () => {
        const gimli: Adventurer = {
            id: null, name: "Gimli", weapons: [],
            hp: 1, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        };
        const encounterId = randomUUID();
        healService.heal.mockReturnValue({
            id: null, name: "Gimli", weapons: [],
            hp: 6, attack: 5, defense: 5, money: 0, numberOfPotions: 1,
        });
        const goblin = goblinMonster();
        diceThrower.rollToHit.mockReturnValue(true);

        const result = combatService.heal(gimli, {
            id: encounterId, adventurerId: gimli.id!, monster: goblin,
        });

        expect(result.actions).toHaveLength(2);
        expect(result.actions[0]).toBe("Gimli heals for 5 hp!");
        expect(result.actions[1]).toBe("Goblin attacks... And hit for 1 damage!");
        expect(result.updatedAdventurer).toEqual({
            id: null, name: "Gimli", weapons: [],
            hp: 5, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        });
    });

    test('adventurerCanHealThemselfOnlyTwicePerEncounter', () => {
        const gimli: Adventurer = {
            id: null, name: "Gimli", weapons: [],
            hp: 1, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        };
        const encounterId = randomUUID();
        const healedGimli: Adventurer = {
            id: null, name: "Gimli", weapons: [],
            hp: 6, attack: 5, defense: 5, money: 0, numberOfPotions: 1,
        };
        healService.heal.mockImplementation((adventurer: Adventurer, _encId: string) => {
            if (adventurer === healedGimli) {
                throw new IllegalPotionUsageException();
            }
            return healedGimli;
        });
        const goblin = goblinMonster();
        diceThrower.rollToHit.mockReturnValue(false);

        for (let i = 0; i < 2; i++) {
            combatService.heal(gimli, {
                id: encounterId, adventurerId: gimli.id!, monster: goblin,
            });
        }
        expect(() => {
            combatService.heal(healedGimli, {
                id: encounterId, adventurerId: gimli.id!, monster: goblin,
            });
        }).toThrow(IllegalPotionUsageException);
    });

    test('adventurerCanHealAndThenDieFromMonsterAttack', () => {
        const gimli: Adventurer = {
            id: null, name: "Gimli", weapons: [],
            hp: 1, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        };
        const encounterId = randomUUID();
        healService.heal.mockReturnValue({
            id: null, name: "Gimli", weapons: [],
            hp: 6, attack: 5, defense: 5, money: 0, numberOfPotions: 1,
        });
        const goblin = goblinMonster();
        diceThrower.rollToHit.mockReturnValue(true);
        damageCalculatorService.getDamage.mockReturnValue(10);

        const result = combatService.heal(gimli, {
            id: encounterId, adventurerId: gimli.id!, monster: goblin,
        });

        expect(result.actions).toHaveLength(3);
        expect(result.actions[0]).toBe("Gimli heals for 5 hp!");
        expect(result.actions[1]).toBe("Goblin attacks... And hit for 10 damage!");
        expect(result.actions[2]).toBe("Gimli is dead!");
        expect(result.updatedAdventurer).toEqual({
            id: null, name: "Gimli", weapons: [],
            hp: -4, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        });
    });

    function gimliAdventurer(): Adventurer {
        return {
            id: null, name: "Gimli", weapons: [Weapon.AXE],
            hp: 20, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        };
    }

    function goblinMonster(): Monster {
        return { name: "Goblin", hp: 2, attack: 5, defense: 7 };
    }
});
