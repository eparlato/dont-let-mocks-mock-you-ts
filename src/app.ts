import express from 'express';
import Database from 'better-sqlite3';
import { Server } from 'http';
import { DatabaseInitializer } from './config/database-initializer.js';
import { CombatController } from './controller/combat-controller.js';
import { CombatService } from './domain/combat-service.js';
import { DamageCalculatorService } from './domain/damage-calculator-service.js';
import { DiceThrower } from './domain/dice-thrower.js';
import { HealService } from './domain/heal-service.js';
import { AdventurerService } from './domain/adventurer-service.js';
import { SqliteAdventurerRepository } from './repository/sqlite-adventurer-repository.js';
import { SqliteEncounterRepository } from './repository/sqlite-encounter-repository.js';

const SQLITE_APP_DB = "./app.db";

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/.*\//, ''))) {
    main();
}

export function main(): Server {
    initDb();
    const db = new Database(SQLITE_APP_DB);
    const adventurerRepository = new SqliteAdventurerRepository(db);
    const encounterRepository = new SqliteEncounterRepository(db);

    const diceThrower = new DiceThrower();
    const damageCalculatorService = new DamageCalculatorService();
    const healService = new HealService();
    const combatService = new CombatService(diceThrower, damageCalculatorService, healService);
    const adventurerService = new AdventurerService(adventurerRepository, encounterRepository, combatService);

    const combatController = new CombatController(adventurerService);

    const app = express();
    combatController.registerRoutes(app);
    return app.listen(7000);
}

export function initDb(): void {
    DatabaseInitializer.init(SQLITE_APP_DB);
}
