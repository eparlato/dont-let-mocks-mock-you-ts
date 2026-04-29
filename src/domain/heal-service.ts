import { Adventurer } from './adventurer.js';
import { NoPotionsException } from './exception/no-potions-exception.js';
import { PotionLimitUsageReachedException } from './exception/potion-limit-usage-reached-exception.js';

export class HealService {

    readonly usedPotions: string[] = [];

    heal(adventurer: Adventurer, encounterId: string): Adventurer {
        if (adventurer.numberOfPotions <= 0) {
            throw new NoPotionsException();
        }
        if (this.usedPotions.includes(encounterId)) {
            throw new PotionLimitUsageReachedException();
        }

        this.usedPotions.push(encounterId);
        return {
            id: adventurer.id,
            name: adventurer.name,
            weapons: adventurer.weapons,
            hp: adventurer.hp + 5,
            attack: adventurer.attack,
            defense: adventurer.defense,
            money: adventurer.money,
            numberOfPotions: adventurer.numberOfPotions - 1,
        };
    }
}
