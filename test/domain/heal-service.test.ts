import { describe, test, expect } from 'vitest';
import { randomUUID } from 'crypto';
import { HealService } from '../../src/domain/heal-service.js';
import { Adventurer } from '../../src/domain/adventurer.js';
import { Weapon } from '../../src/domain/weapon.js';
import { NoPotionsException } from '../../src/domain/exception/no-potions-exception.js';
import { PotionLimitUsageReachedException } from '../../src/domain/exception/potion-limit-usage-reached-exception.js';

describe('HealServiceTest', () => {

    test('healIncreasesHpAndDecreasesPotions', () => {
        const healService = new HealService();
        const adventurer: Adventurer = {
            id: null,
            name: "Aragorn",
            weapons: [Weapon.SWORD],
            hp: 10,
            attack: 5,
            defense: 3,
            money: 100,
            numberOfPotions: 2,
        };

        const healedAdventurer = healService.heal(adventurer, randomUUID());

        expect(healedAdventurer.hp).toBe(15);
        expect(healedAdventurer.numberOfPotions).toBe(1);
    });

    test('healDoesNotChangeHpIfNoPotions', () => {
        const healService = new HealService();
        const adventurer: Adventurer = {
            id: null,
            name: "Gimli",
            weapons: [Weapon.AXE],
            hp: 10,
            attack: 5,
            defense: 3,
            money: 100,
            numberOfPotions: 0,
        };

        expect(() => healService.heal(adventurer, randomUUID())).toThrow(NoPotionsException);
    });

    test('adventurerCanOnlyHealOncePerEncounter', () => {
        const healService = new HealService();
        const adventurer: Adventurer = {
            id: null,
            name: "Frodo",
            weapons: [Weapon.DAGGER],
            hp: 10,
            attack: 5,
            defense: 3,
            money: 100,
            numberOfPotions: 2,
        };

        const encounterId = randomUUID();
        const healedAdventurer = healService.heal(adventurer, encounterId);
        expect(healedAdventurer.hp).toBe(15);
        expect(healedAdventurer.numberOfPotions).toBe(1);

        expect(() => healService.heal(healedAdventurer, encounterId)).toThrow(PotionLimitUsageReachedException);
    });
});
