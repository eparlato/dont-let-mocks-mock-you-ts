import { randomUUID } from 'crypto';
import { Adventurer } from './adventurer.js';
import { AdventurerRepository } from './adventurer-repository.js';
import { CombatService } from './combat-service.js';
import { Encounter } from './encounter.js';
import { EncounterRepository } from './encounter-repository.js';
import { Monster } from './monster.js';
import { Weapon } from './weapon.js';
import { NoPotionsException } from './exception/no-potions-exception.js';
import { IllegalPotionUsageException } from './exception/illegal-potion-usage-exception.js';

export class AdventurerService {
    private readonly adventurerRepository: AdventurerRepository;
    private readonly encounterRepository: EncounterRepository;
    private readonly combatService: CombatService;

    constructor(adventurerRepository: AdventurerRepository, encounterRepository: EncounterRepository,
                combatService: CombatService) {
        this.adventurerRepository = adventurerRepository;
        this.encounterRepository = encounterRepository;
        this.combatService = combatService;
    }

    createAdventurer(name: string, weapons: Weapon[]): Adventurer {
        const adventurer: Adventurer = {
            id: randomUUID(),
            name,
            weapons,
            hp: 20,
            attack: 5,
            defense: 5,
            money: 0,
            numberOfPotions: 2,
        };

        this.adventurerRepository.save(adventurer);

        return adventurer;
    }

    startEncounter(adventurerId: string): Encounter {
        const adventurer = this.adventurerRepository.findById(adventurerId);
        if (!adventurer) {
            throw new Error("Adventurer not found");
        }

        const encounter: Encounter = {
            id: randomUUID(),
            adventurerId: adventurer.id!,
            monster: this.spawnMonster(),
        };

        this.encounterRepository.save(encounter);

        return encounter;
    }

    attack(id: string): string[] {
        const adventurer = this.adventurerRepository.findById(id);
        if (!adventurer) throw new Error("Adventurer not found");
        const encounter = this.encounterRepository.findByAdventurerId(adventurer.id!);
        if (!encounter) throw new Error("Encounter not found");
        const monster = encounter.monster;
        const attackResult = this.combatService.handleAttack(adventurer, monster);

        if (attackResult.updatedAdventurer.hp <= 0) {
            this.adventurerRepository.delete(adventurer.id!);
            this.encounterRepository.delete(encounter.id);
        } else {
            this.adventurerRepository.update(attackResult.updatedAdventurer);
        }
        if (encounter.monster.hp <= 0) {
            this.encounterRepository.delete(encounter.id);
        } else {
            this.encounterRepository.update({
                id: encounter.id,
                adventurerId: encounter.adventurerId,
                monster: attackResult.updatedMonster,
            });
        }
        return attackResult.actions;
    }

    heal(adventurerId: string): string[] {
        const adventurer = this.adventurerRepository.findById(adventurerId);
        if (!adventurer) throw new Error("Adventurer not found");
        const encounter = this.encounterRepository.findByAdventurerId(adventurer.id!);
        if (!encounter) throw new Error("Encounter not found");

        try {
            const attackResult = this.combatService.heal(adventurer, encounter);
            this.adventurerRepository.update(attackResult.updatedAdventurer);
            return attackResult.actions;
        } catch (e) {
            if (e instanceof NoPotionsException || e instanceof IllegalPotionUsageException) {
                throw e;
            }
            throw e;
        }
    }

    private spawnMonster(): Monster {
        return Math.random() < 0.66
            ? { name: "Goblin", hp: 10, attack: 2, defense: 2 }
            : { name: "Azog il Goblin", hp: 100, attack: 10, defense: 5 };
    }
}
