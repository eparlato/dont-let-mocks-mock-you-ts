import { describe, test, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { existsSync, unlinkSync } from 'fs';
import { randomUUID } from 'crypto';
import { DatabaseInitializer } from '../../src/config/database-initializer.js';
import { SqliteEncounterRepository } from '../../src/repository/sqlite-encounter-repository.js';
import { Encounter } from '../../src/domain/encounter.js';

describe('SqliteEncounterRepositoryTest', () => {
    const DB_PATH = "./test.db";
    let repository: SqliteEncounterRepository;

    beforeEach(() => {
        if (existsSync(DB_PATH)) unlinkSync(DB_PATH);
        DatabaseInitializer.init(DB_PATH);
        const connection = new Database(DB_PATH);
        repository = new SqliteEncounterRepository(new Database(DB_PATH));

        connection.exec(
            "INSERT INTO encounters (id, adventurer_id, monster_name, monster_hp, monster_attack, monster_defense) " +
            "VALUES ('2ffd9e0f-334c-4b16-969c-08fa9da7dc2c', '870d5ef2-8fbe-4ef9-ad23-5a1361df200e', 'Goblin', 100, 20, 10)"
        );
    });

    test('load', () => {
        const savedEncounter = repository.findById("2ffd9e0f-334c-4b16-969c-08fa9da7dc2c");
        expect(savedEncounter).toBeDefined();
        expect(savedEncounter!.adventurerId).toBe("870d5ef2-8fbe-4ef9-ad23-5a1361df200e");
        expect(savedEncounter!.monster.name).toBe("Goblin");
    });

    test('save', () => {
        const encounter: Encounter = {
            id: "82f8ec70-b7b4-4971-b764-3d49e35cd24a",
            adventurerId: randomUUID(),
            monster: { name: "Goblin", hp: 100, attack: 20, defense: 10 },
        };
        repository.save(encounter);

        const savedEncounter = repository.findById("82f8ec70-b7b4-4971-b764-3d49e35cd24a");
        expect(savedEncounter).toBeDefined();
    });

    test('shouldUpdateEncounter', () => {
        const encounter = repository.findById("2ffd9e0f-334c-4b16-969c-08fa9da7dc2c")!;
        const updatedEncounter: Encounter = {
            id: encounter.id,
            adventurerId: encounter.adventurerId,
            monster: { name: "Orc", hp: 120, attack: 25, defense: 15 },
        };
        repository.update(updatedEncounter);

        const savedEncounter = repository.findById(encounter.id);
        expect(savedEncounter).toBeDefined();
        expect(savedEncounter!.monster.name).toBe("Orc");
        expect(savedEncounter!.monster.hp).toBe(120);
    });

    test('shouldDeleteEncounter', () => {
        const encounterId = "2ffd9e0f-334c-4b16-969c-08fa9da7dc2c";

        repository.delete(encounterId);

        const deletedEncounter = repository.findById(encounterId);
        expect(deletedEncounter).toBeUndefined();
    });

    test('shouldFindByAdventurerId', () => {
        const adventurerId = "870d5ef2-8fbe-4ef9-ad23-5a1361df200e";

        const encounter = repository.findByAdventurerId(adventurerId);

        expect(encounter).toBeDefined();
        expect(encounter!.monster.name).toBe("Goblin");
    });
});
