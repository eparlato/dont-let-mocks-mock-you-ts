import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { existsSync, unlinkSync } from 'fs';
import { DatabaseInitializer } from '../../src/config/database-initializer.js';
import { SqliteAdventurerRepository } from '../../src/repository/sqlite-adventurer-repository.js';
import { Adventurer } from '../../src/domain/adventurer.js';
import { Weapon } from '../../src/domain/weapon.js';
import { randomUUID } from 'crypto';

describe('SqliteAdventurerRepositoryTest', () => {
    const DB_PATH = "./test2.db";
    let repository: SqliteAdventurerRepository;
    let connection: Database.Database;

    beforeEach(() => {
        if (existsSync(DB_PATH)) unlinkSync(DB_PATH);
        DatabaseInitializer.init(DB_PATH);
        connection = new Database(DB_PATH);
        repository = new SqliteAdventurerRepository(new Database(DB_PATH));

        connection.exec(
            "INSERT INTO adventurers (id, name, weapon, hp, attack, defense, money, number_of_potions) " +
            "VALUES ('2ffd9e0f-334c-4b16-969c-08fa9da7dc2c', 'Gianni', 'SWORD', 100, 20, 10, 0, 2)"
        );
    });

    test('returnsCharacterWhenExists', () => {
        const c = repository.findById("2ffd9e0f-334c-4b16-969c-08fa9da7dc2c");
        expect(c).toBeDefined();
        expect(c!.id).toBe("2ffd9e0f-334c-4b16-969c-08fa9da7dc2c");
        expect(c!.name).toBe("Gianni");
        expect(c!.hp).toBe(100);
    });

    test('returnsUndefinedWhenNotExists', () => {
        const c = repository.findById("870d5ef2-8fbe-4ef9-ad23-5a1361df200e");
        expect(c).toBeUndefined();
    });

    test('shouldSaveANewAdventurer', () => {
        const newAdventurer: Adventurer = {
            id: randomUUID(),
            name: "Aragorn",
            weapons: [Weapon.SWORD],
            hp: 120,
            attack: 30,
            defense: 20,
            money: 100,
            numberOfPotions: 5,
        };
        repository.save(newAdventurer);

        const savedAdventurer = repository.findById(newAdventurer.id!);

        expect(savedAdventurer).toBeDefined();
        expect(savedAdventurer!.name).toBe("Aragorn");
        expect(savedAdventurer!.hp).toBe(120);
    });

    test('shouldUpdateAdventurer', () => {
        const adventurer = repository.findById("2ffd9e0f-334c-4b16-969c-08fa9da7dc2c")!;
        const updatedAdventurer: Adventurer = {
            id: adventurer.id,
            name: adventurer.name,
            weapons: adventurer.weapons,
            hp: 90, // Updated HP
            attack: adventurer.attack,
            defense: adventurer.defense,
            money: adventurer.money,
            numberOfPotions: adventurer.numberOfPotions,
        };
        repository.update(updatedAdventurer);

        const updatedAdventurerOnDb = repository.findById("2ffd9e0f-334c-4b16-969c-08fa9da7dc2c")!;
        expect(updatedAdventurerOnDb.hp).toBe(90);
    });

    test('shouldMapEmptyWeaponStringToEmptyList', () => {
        connection.exec(
            "INSERT INTO adventurers (id, name, weapon, hp, attack, defense, money, number_of_potions) " +
            "VALUES ('12345678-1234-1234-1234-123456789012', 'Legolas', '', 100, 20, 10, 0, 2)"
        );

        const adventurer = repository.findById("12345678-1234-1234-1234-123456789012");

        expect(adventurer).toBeDefined();
        expect(adventurer!.name).toBe("Legolas");
        expect(adventurer!.weapons).toEqual([]);
    });

    test('shouldDeleteAdventurer', () => {
        const adventurerId = "2ffd9e0f-334c-4b16-969c-08fa9da7dc2c";

        repository.delete(adventurerId);

        const deletedAdventurer = repository.findById(adventurerId);
        expect(deletedAdventurer).toBeUndefined();
    });

    afterEach(() => {
        connection.close();
        if (existsSync(DB_PATH)) unlinkSync(DB_PATH);
    });
});
