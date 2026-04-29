import { describe, test, expect, vi, type Mock } from 'vitest';
import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';
import { CombatController } from '../../src/controller/combat-controller.js';
import { AdventurerService } from '../../src/domain/adventurer-service.js';
import { Weapon } from '../../src/domain/weapon.js';

describe('CombatControllerTest', () => {

    test('creatingANewCharacterWithAxeCallsTheCorrectService', () => {
        const name = "Gianni";
        const weapon = "Axe";
        const mockAdventurerService = {
            createAdventurer: vi.fn(), startEncounter: vi.fn(),
            attack: vi.fn(), heal: vi.fn(),
        };
        const req = { params: { name, weapon } } as unknown as Request;
        const res = { json: vi.fn() } as unknown as Response;
        const controller = new CombatController(mockAdventurerService as unknown as AdventurerService);

        controller.createAdventurer(req, res);

        expect(mockAdventurerService.createAdventurer).toHaveBeenCalledWith(name, [Weapon.AXE]);
    });

    test('creatingANewCharacterWithDaggersCallsTheCorrectService', () => {
        const name = "Gianni";
        const weapon = "Daggers";
        const mockAdventurerService = {
            createAdventurer: vi.fn(), startEncounter: vi.fn(),
            attack: vi.fn(), heal: vi.fn(),
        };
        const req = { params: { name, weapon } } as unknown as Request;
        const res = { json: vi.fn() } as unknown as Response;
        const controller = new CombatController(mockAdventurerService as unknown as AdventurerService);

        controller.createAdventurer(req, res);

        expect(mockAdventurerService.createAdventurer).toHaveBeenCalledWith(name, [Weapon.DAGGER, Weapon.DAGGER]);
    });

    test('creatingANewCharacterWithSwordCallsTheCorrectService', () => {
        const name = "Gianni";
        const weapon = "Sword";
        const mockAdventurerService = {
            createAdventurer: vi.fn(), startEncounter: vi.fn(),
            attack: vi.fn(), heal: vi.fn(),
        };
        const req = { params: { name, weapon } } as unknown as Request;
        const res = { json: vi.fn() } as unknown as Response;
        const controller = new CombatController(mockAdventurerService as unknown as AdventurerService);

        controller.createAdventurer(req, res);

        expect(mockAdventurerService.createAdventurer).toHaveBeenCalledWith(name, [Weapon.SWORD]);
    });

    test('creatingANewCharacterWithFistsCallsTheCorrectService', () => {
        const name = "Gianni";
        const weapon = "Fists";
        const mockAdventurerService = {
            createAdventurer: vi.fn(), startEncounter: vi.fn(),
            attack: vi.fn(), heal: vi.fn(),
        };
        const req = { params: { name, weapon } } as unknown as Request;
        const res = { json: vi.fn() } as unknown as Response;
        const controller = new CombatController(mockAdventurerService as unknown as AdventurerService);

        controller.createAdventurer(req, res);

        expect(mockAdventurerService.createAdventurer).toHaveBeenCalledWith(name, []);
    });

    test('startingANewEncounterCallsTheCorrectService', () => {
        const adventurerId = randomUUID();
        const mockAdventurerService = {
            createAdventurer: vi.fn(), startEncounter: vi.fn(),
            attack: vi.fn(), heal: vi.fn(),
        };
        const req = { params: { adventurerId } } as unknown as Request;
        const res = { json: vi.fn() } as unknown as Response;
        const controller = new CombatController(mockAdventurerService as unknown as AdventurerService);

        controller.startEncounter(req, res);

        expect(mockAdventurerService.startEncounter).toHaveBeenCalledWith(adventurerId);
    });

    test('attackingCallsTheCorrectService', () => {
        const adventurerId = randomUUID();
        const mockAdventurerService = {
            createAdventurer: vi.fn(), startEncounter: vi.fn(),
            attack: vi.fn(), heal: vi.fn(),
        };
        const req = { params: { adventurerId } } as unknown as Request;
        const res = { json: vi.fn() } as unknown as Response;
        const controller = new CombatController(mockAdventurerService as unknown as AdventurerService);

        controller.attack(req, res);

        expect(mockAdventurerService.attack).toHaveBeenCalledWith(adventurerId);
    });

    test('healingCallsTheCorrectService', () => {
        const adventurerId = randomUUID();
        const mockAdventurerService = {
            createAdventurer: vi.fn(), startEncounter: vi.fn(),
            attack: vi.fn(), heal: vi.fn(),
        };
        const req = { params: { adventurerId } } as unknown as Request;
        const res = { json: vi.fn() } as unknown as Response;
        const controller = new CombatController(mockAdventurerService as unknown as AdventurerService);

        controller.heal(req, res);

        expect(mockAdventurerService.heal).toHaveBeenCalledWith(adventurerId);
    });
});
