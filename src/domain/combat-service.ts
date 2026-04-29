import { Adventurer } from './adventurer.js';
import { AttackResult } from './attack-result.js';
import { DamageCalculatorService } from './damage-calculator-service.js';
import { DiceThrower } from './dice-thrower.js';
import { Encounter } from './encounter.js';
import { HealService } from './heal-service.js';
import { Monster } from './monster.js';
import { Weapon } from './weapon.js';

export class CombatService {

    private readonly diceThrower: DiceThrower;
    private readonly damageCalculatorService: DamageCalculatorService;
    private readonly healService: HealService;

    constructor(diceThrower: DiceThrower, damageCalculatorService: DamageCalculatorService,
                healService: HealService) {
        this.diceThrower = diceThrower;
        this.damageCalculatorService = damageCalculatorService;
        this.healService = healService;
    }

    handleAttack(adventurer: Adventurer, monster: Monster): AttackResult {
        const actions: string[] = [];
        let damageDealtByAdventurer = 0;
        let damageDealtByMonster = 0;
        if (this.diceThrower.rollToHit()) {
            damageDealtByAdventurer =
                this.damageCalculatorService.getDamage(adventurer.attack, adventurer.weapons, monster.defense);
            actions.push(adventurer.name + " attacks... And hit for " + damageDealtByAdventurer + " damage!");
            if (monster.hp - damageDealtByAdventurer <= 0) {
                actions.push(monster.name + " is dead!");
            }
        } else {
            actions.push(adventurer.name + " attacks... But misses!");
        }
        if (monster.hp - damageDealtByAdventurer > 0) {
            if (this.diceThrower.rollToHit()) {
                damageDealtByMonster =
                    this.damageCalculatorService.getDamage(monster.attack, [Weapon.CLUB], adventurer.defense);
                actions.push(monster.name + " attacks... And hit for " + damageDealtByMonster + " damage!");
                if (adventurer.hp - damageDealtByMonster <= 0) {
                    actions.push(adventurer.name + " is dead!");
                }
            } else {
                actions.push(monster.name + " attacks... But misses!");
            }
        }

        return {
            actions,
            updatedAdventurer: {
                id: adventurer.id,
                name: adventurer.name,
                weapons: adventurer.weapons,
                hp: adventurer.hp - damageDealtByMonster,
                attack: adventurer.attack,
                defense: adventurer.defense,
                money: adventurer.money,
                numberOfPotions: adventurer.numberOfPotions,
            },
            updatedMonster: {
                name: monster.name,
                hp: monster.hp - damageDealtByAdventurer,
                attack: monster.attack,
                defense: monster.defense,
            },
        };
    }

    heal(adventurer: Adventurer, encounter: Encounter): AttackResult {
        const monster = encounter.monster;
        const actions: string[] = [];
        let damageDealtByMonster = 0;

        const healedAdventurer = this.healService.heal(adventurer, encounter.id);
        actions.push(adventurer.name + " heals for 5 hp!");

        if (this.diceThrower.rollToHit()) {
            damageDealtByMonster =
                this.damageCalculatorService.getDamage(monster.attack, [Weapon.CLUB], adventurer.defense);
            actions.push(monster.name + " attacks... And hit for " + damageDealtByMonster + " damage!");
            if (healedAdventurer.hp - damageDealtByMonster <= 0) {
                actions.push(adventurer.name + " is dead!");
            }
        } else {
            actions.push(monster.name + " attacks... But misses!");
        }

        return {
            actions,
            updatedAdventurer: {
                id: adventurer.id,
                name: adventurer.name,
                weapons: adventurer.weapons,
                hp: healedAdventurer.hp - damageDealtByMonster,
                attack: adventurer.attack,
                defense: adventurer.defense,
                money: adventurer.money,
                numberOfPotions: adventurer.numberOfPotions,
            },
            updatedMonster: monster,
        };
    }
}
