import { describe, test, expect, beforeEach, vi, type Mock } from 'vitest';
import { randomUUID } from 'crypto';
import { AdventurerService } from '../../src/domain/adventurer-service.js';
import { AdventurerRepository } from '../../src/domain/adventurer-repository.js';
import { EncounterRepository } from '../../src/domain/encounter-repository.js';
import { CombatService } from '../../src/domain/combat-service.js';
import { Adventurer } from '../../src/domain/adventurer.js';
import { Encounter } from '../../src/domain/encounter.js';
import { Monster } from '../../src/domain/monster.js';
import { Weapon } from '../../src/domain/weapon.js';
import { InMemoryAdventurerRepository } from '../repository/in-memory-adventurer-repository.js';
import { InMemoryEncounterRepository } from '../repository/in-memory-encounter-repository.js';

describe('AdventurerServiceTest', () => {

    let adventurerRepository: {
        save: Mock; findById: Mock; update: Mock; delete: Mock;
    };
    let encounterRepository: {
        save: Mock; findById: Mock; findByAdventurerId: Mock; update: Mock; delete: Mock;
    };
    let combatService: {
        handleAttack: Mock; heal: Mock;
    };
    let adventurerService: AdventurerService;

    beforeEach(() => {
        adventurerRepository = {
            save: vi.fn(), findById: vi.fn(), update: vi.fn(), delete: vi.fn(),
        };
        encounterRepository = {
            save: vi.fn(), findById: vi.fn(), findByAdventurerId: vi.fn(),
            update: vi.fn(), delete: vi.fn(),
        };
        combatService = {
            handleAttack: vi.fn(), heal: vi.fn(),
        };
        adventurerService = new AdventurerService(
            adventurerRepository as unknown as AdventurerRepository,
            encounterRepository as unknown as EncounterRepository,
            combatService as unknown as CombatService,
        );
    });

    test('shouldSaveANewHeroWithDefaultValues', () => {
        adventurerService.createAdventurer("Gimli", [Weapon.AXE]);

        expect(adventurerRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "Gimli",
                weapons: [Weapon.AXE],
                hp: 20,
                attack: 5,
                defense: 5,
                money: 0,
                numberOfPotions: 2,
            })
        );
    });

    test('canStartANewEncounter', () => {
        const id = randomUUID();
        adventurerRepository.findById.mockReturnValue({
            id, name: "Gimli", weapons: [Weapon.AXE],
            hp: 20, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        });

        const encounter = adventurerService.startEncounter(id);

        expect(encounterRepository.save).toHaveBeenCalledWith(encounter);
    });

    test('canAttackAMonster', () => {
        const adventurerId = randomUUID();
        const encounterId = randomUUID();
        const adventurer: Adventurer = {
            id: adventurerId, name: "Gimli", weapons: [Weapon.AXE],
            hp: 20, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        };
        const encounter: Encounter = {
            id: encounterId, adventurerId,
            monster: { name: "Goblin", hp: 10, attack: 2, defense: 2 },
        };
        adventurerRepository.findById.mockReturnValue(adventurer);
        encounterRepository.findByAdventurerId.mockReturnValue(encounter);
        combatService.handleAttack.mockReturnValue({
            actions: ["Attack successful!"],
            updatedAdventurer: adventurer,
            updatedMonster: encounter.monster,
        });

        const attack = adventurerService.attack(adventurerId);

        expect(attack).not.toBeNull();
        expect(adventurerRepository.findById).toHaveBeenCalledWith(adventurerId);
        expect(encounterRepository.findByAdventurerId).toHaveBeenCalledWith(adventurerId);
        expect(combatService.handleAttack).toHaveBeenCalledWith(adventurer, encounter.monster);
        expect(adventurerRepository.update).toHaveBeenCalledWith(adventurer);
        expect(encounterRepository.update).toHaveBeenCalledWith(encounter);
    });

    test('canAttackAMonster_withFakeRepositories', () => {
        const fakeAdventurerRepository = new InMemoryAdventurerRepository();
        const fakeEncounterRepository = new InMemoryEncounterRepository();
        const serviceWithFakes = new AdventurerService(
            fakeAdventurerRepository,
            fakeEncounterRepository,
            combatService as unknown as CombatService,
        );

        const adventurerId = randomUUID();
        const encounterId = randomUUID();
        const adventurer: Adventurer = {
            id: adventurerId, name: "Gimli", weapons: [Weapon.AXE],
            hp: 20, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        };
        const monster: Monster = { name: "Goblin", hp: 10, attack: 2, defense: 2 };
        const encounter: Encounter = {
            id: encounterId, adventurerId, monster,
        };

        fakeAdventurerRepository.save(adventurer);
        fakeEncounterRepository.save(encounter);
        combatService.handleAttack.mockReturnValue({
            actions: ["Attack successful!"],
            updatedAdventurer: adventurer,
            updatedMonster: monster,
        });

        const actions = serviceWithFakes.attack(adventurerId);

        expect(actions).toEqual(["Attack successful!"]);
        expect(fakeAdventurerRepository.findById(adventurerId)).toEqual(adventurer);
        expect(fakeEncounterRepository.findById(encounterId)).toBeDefined();
        expect(fakeEncounterRepository.findById(encounterId)!.monster).toEqual(monster);
    });

    test('handleMonsterDefeat', () => {
        const adventurerId = randomUUID();
        const encounterId = randomUUID();
        const adventurer: Adventurer = {
            id: adventurerId, name: "Gimli", weapons: [Weapon.AXE],
            hp: 20, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        };
        const encounter: Encounter = {
            id: encounterId, adventurerId,
            monster: { name: "Goblin", hp: 0, attack: 2, defense: 2 },
        };
        adventurerRepository.findById.mockReturnValue(adventurer);
        encounterRepository.findByAdventurerId.mockReturnValue(encounter);
        combatService.handleAttack.mockReturnValue({
            actions: ["Attack successful!"],
            updatedAdventurer: adventurer,
            updatedMonster: encounter.monster,
        });

        const attack = adventurerService.attack(adventurerId);

        expect(attack).not.toBeNull();
        expect(adventurerRepository.findById).toHaveBeenCalledWith(adventurerId);
        expect(encounterRepository.findByAdventurerId).toHaveBeenCalledWith(adventurerId);
        expect(combatService.handleAttack).toHaveBeenCalledWith(adventurer, encounter.monster);
        expect(adventurerRepository.update).toHaveBeenCalledWith(adventurer);
        expect(encounterRepository.delete).toHaveBeenCalledWith(encounter.id);
    });

    test('handleAdventurerDefeat', () => {
        const adventurerId = randomUUID();
        const encounterId = randomUUID();
        const adventurer: Adventurer = {
            id: adventurerId, name: "Gimli", weapons: [Weapon.AXE],
            hp: 0, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        };
        const encounter: Encounter = {
            id: encounterId, adventurerId,
            monster: { name: "Goblin", hp: 1, attack: 2, defense: 2 },
        };
        adventurerRepository.findById.mockReturnValue(adventurer);
        encounterRepository.findByAdventurerId.mockReturnValue(encounter);
        combatService.handleAttack.mockReturnValue({
            actions: ["Attack successful!"],
            updatedAdventurer: adventurer,
            updatedMonster: encounter.monster,
        });

        const attack = adventurerService.attack(adventurerId);

        expect(attack).not.toBeNull();
        expect(adventurerRepository.findById).toHaveBeenCalledWith(adventurerId);
        expect(encounterRepository.findByAdventurerId).toHaveBeenCalledWith(adventurerId);
        expect(combatService.handleAttack).toHaveBeenCalledWith(adventurer, encounter.monster);
        expect(adventurerRepository.delete).toHaveBeenCalledWith(adventurer.id);
        expect(encounterRepository.delete).toHaveBeenCalledWith(encounter.id);
    });

    test('adventurerCanHeal', () => {
        const adventurerId = randomUUID();
        const encounterId = randomUUID();
        const adventurer: Adventurer = {
            id: adventurerId, name: "Gimli", weapons: [Weapon.AXE],
            hp: 1, attack: 5, defense: 5, money: 0, numberOfPotions: 2,
        };
        const encounter: Encounter = {
            id: encounterId, adventurerId,
            monster: { name: "Goblin", hp: 1, attack: 2, defense: 2 },
        };
        adventurerRepository.findById.mockReturnValue(adventurer);
        encounterRepository.findByAdventurerId.mockReturnValue(encounter);
        const healedAdventurer: Adventurer = {
            id: adventurerId, name: "Gimli", weapons: [Weapon.AXE],
            hp: 6, attack: 5, defense: 5, money: 0, numberOfPotions: 1,
        };
        combatService.heal.mockReturnValue({
            actions: ["Gimli heals for 5 hp!"],
            updatedAdventurer: healedAdventurer,
            updatedMonster: encounter.monster,
        });

        const actions = adventurerService.heal(adventurerId);

        expect(actions).not.toBeNull();
        expect(adventurerRepository.findById).toHaveBeenCalledWith(adventurerId);
        expect(encounterRepository.findByAdventurerId).toHaveBeenCalledWith(adventurerId);
        expect(combatService.heal).toHaveBeenCalledWith(adventurer, encounter);
        expect(adventurerRepository.update).toHaveBeenCalledWith(healedAdventurer);
    });
});
