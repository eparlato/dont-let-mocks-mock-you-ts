import Database from 'better-sqlite3';
import { Encounter } from '../domain/encounter.js';
import { EncounterRepository } from '../domain/encounter-repository.js';

export class SqliteEncounterRepository implements EncounterRepository {
    private readonly db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    save(encounter: Encounter): void {
        this.db.prepare(
            "INSERT INTO encounters (id, adventurer_id, monster_name, monster_hp, monster_attack, monster_defense) VALUES (?, ?, ?, ?, ?, ?)"
        ).run(
            encounter.id,
            encounter.adventurerId,
            encounter.monster.name,
            encounter.monster.hp,
            encounter.monster.attack,
            encounter.monster.defense,
        );
    }

    findById(id: string): Encounter | undefined {
        const row = this.db.prepare(
            "SELECT id, adventurer_id, monster_name, monster_hp, monster_attack, monster_defense FROM encounters WHERE id = ?"
        ).get(id) as any;
        if (row) {
            return {
                id: row.id,
                adventurerId: row.adventurer_id,
                monster: {
                    name: row.monster_name,
                    hp: row.monster_hp,
                    attack: row.monster_attack,
                    defense: row.monster_defense,
                },
            };
        }
        return undefined;
    }

    findByAdventurerId(id: string): Encounter | undefined {
        const row = this.db.prepare(
            "SELECT id, adventurer_id, monster_name, monster_hp, monster_attack, monster_defense FROM encounters WHERE adventurer_id = ?"
        ).get(id) as any;
        if (row) {
            return {
                id: row.id,
                adventurerId: row.adventurer_id,
                monster: {
                    name: row.monster_name,
                    hp: row.monster_hp,
                    attack: row.monster_attack,
                    defense: row.monster_defense,
                },
            };
        }
        return undefined;
    }

    update(encounter: Encounter): void {
        this.db.prepare(
            "UPDATE encounters SET adventurer_id = ?, monster_name = ?, monster_hp = ?, monster_attack = ?, monster_defense = ? WHERE id = ?"
        ).run(
            encounter.adventurerId,
            encounter.monster.name,
            encounter.monster.hp,
            encounter.monster.attack,
            encounter.monster.defense,
            encounter.id,
        );
    }

    delete(id: string): void {
        this.db.prepare("DELETE FROM encounters WHERE id = ?").run(id);
    }
}
