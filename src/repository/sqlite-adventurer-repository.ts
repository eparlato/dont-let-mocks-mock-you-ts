import Database from 'better-sqlite3';
import { Adventurer } from '../domain/adventurer.js';
import { AdventurerRepository } from '../domain/adventurer-repository.js';
import { Weapon } from '../domain/weapon.js';

export class SqliteAdventurerRepository implements AdventurerRepository {
    private readonly db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    save(adventurer: Adventurer): void {
        this.db.prepare(
            "INSERT INTO adventurers (id, name, weapon, hp, attack, defense, money, number_of_potions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).run(
            adventurer.id,
            adventurer.name,
            adventurer.weapons.map(w => w as string).join(","),
            adventurer.hp,
            adventurer.attack,
            adventurer.defense,
            adventurer.money,
            adventurer.numberOfPotions,
        );
    }

    findById(id: string): Adventurer | undefined {
        const row = this.db.prepare(
            "SELECT id, name, weapon, hp, attack, defense, money, number_of_potions FROM adventurers WHERE id = ?"
        ).get(id) as any;
        if (row) {
            return {
                id: row.id,
                name: row.name,
                weapons: (row.weapon as string).split(",")
                    .filter(s => s !== "")
                    .map(s => s as Weapon),
                hp: row.hp,
                attack: row.attack,
                defense: row.defense,
                money: row.money,
                numberOfPotions: row.number_of_potions,
            };
        }
        return undefined;
    }

    update(adventurer: Adventurer): void {
        this.db.prepare(
            "UPDATE adventurers SET name = ?, weapon = ?, hp = ?, attack = ?, defense = ?, money = ?, number_of_potions = ? WHERE id = ?"
        ).run(
            adventurer.name,
            adventurer.weapons.map(w => w as string).join(","),
            adventurer.hp,
            adventurer.attack,
            adventurer.defense,
            adventurer.money,
            adventurer.numberOfPotions,
            adventurer.id,
        );
    }

    delete(id: string): void {
        this.db.prepare("DELETE FROM adventurers WHERE id = ?").run(id);
    }
}
