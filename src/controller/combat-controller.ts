import type { Application, Request, Response } from 'express';
import { AdventurerService } from '../domain/adventurer-service.js';
import { Weapon } from '../domain/weapon.js';

export class CombatController {
    private readonly adventurerService: AdventurerService;

    constructor(adventurerService: AdventurerService) {
        this.adventurerService = adventurerService;
    }

    createAdventurer(req: Request, res: Response): void {
        const name = req.params.name;
        const weapon = req.params.weapon;

        const adventurer = this.adventurerService.createAdventurer(name, CombatController.mapWeapons(weapon));

        res.json(adventurer);
    }

    private static mapWeapons(weapon: string): Weapon[] {
        switch (weapon.toLowerCase()) {
            case "axe": return [Weapon.AXE];
            case "daggers": return [Weapon.DAGGER, Weapon.DAGGER];
            case "sword": return [Weapon.SWORD];
            default: return [];
        }
    }

    startEncounter(req: Request, res: Response): void {
        const adventurerId = req.params.adventurerId;

        const encounter = this.adventurerService.startEncounter(adventurerId);

        res.json(encounter);
    }

    attack(req: Request, res: Response): void {
        const adventurerId = req.params.adventurerId;

        const actions = this.adventurerService.attack(adventurerId);

        res.json(actions);
    }

    heal(req: Request, res: Response): void {
        const adventurerId = req.params.adventurerId;

        const actions = this.adventurerService.heal(adventurerId);

        res.json(actions);
    }

    registerRoutes(app: Application): void {
        app.post("/create/:name/:weapon", (req, res) => this.createAdventurer(req, res));
        app.post("/start-encounter/:adventurerId", (req, res) => this.startEncounter(req, res));
        app.post("/attack/:adventurerId", (req, res) => this.attack(req, res));
        app.post("/heal/:adventurerId", (req, res) => this.heal(req, res));
    }
}
