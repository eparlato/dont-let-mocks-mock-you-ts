import Database from 'better-sqlite3';

export class DatabaseInitializer {
    static init(dbPath: string): void {
        const db = new Database(dbPath);
        db.exec(`
            CREATE TABLE IF NOT EXISTS adventurers (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                weapon TEXT NOT NULL,
                hp INTEGER NOT NULL,
                attack INTEGER NOT NULL,
                defense INTEGER NOT NULL,
                money INTEGER NOT NULL,
                number_of_potions INTEGER NOT NULL
            );
        `);
        db.exec(`
            CREATE TABLE IF NOT EXISTS encounters (
                id TEXT PRIMARY KEY,
                adventurer_id TEXT NOT NULL,
                monster_name TEXT NOT NULL,
                monster_hp INTEGER NOT NULL,
                monster_attack INTEGER NOT NULL,
                monster_defense INTEGER NOT NULL
            );
        `);
        db.close();
    }
}
