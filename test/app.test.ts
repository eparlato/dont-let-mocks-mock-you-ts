import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { Server } from 'http';
import { main } from '../src/app.js';

describe('AppTest', () => {
    let server: Server;

    beforeAll(async () => {
        server = main();
        // Wait for server to be ready
        let started = false;
        for (let i = 0; i < 30; i++) {
            try {
                const res = await fetch("http://localhost:7000/");
                if (res.status > 0) {
                    started = true;
                    break;
                }
            } catch {
                // not ready yet
            }
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        if (!started) throw new Error("App did not start up in time");
    });

    afterAll(() => {
        server.close();
    });

    test('shouldBeAbleToCreateAnAdventurerWithAxeWeapon', async () => {
        const res = await fetch("http://localhost:7000/create/Gimli/AXE", { method: "POST" });

        expect(res.status).toBe(200);
    });

    test('shouldCreateAdventurerWithFistsWeapon', async () => {
        const res = await fetch("http://localhost:7000/create/Gimli/fists", { method: "POST" });

        expect(res.status).toBe(200);
    });

    test('shouldCompleteFullCombatFlow', async () => {
        // 1. Create an adventurer
        const createRes = await fetch("http://localhost:7000/create/TestHero/axe", { method: "POST" });
        expect(createRes.status).toBe(200);

        const adventurerResponse = await createRes.json() as { id: string };
        const adventurerId = adventurerResponse.id;

        // 2. Start an encounter
        const encounterRes = await fetch(`http://localhost:7000/start-encounter/${adventurerId}`, { method: "POST" });
        expect(encounterRes.status).toBe(200);

        // 3. Attack the monster
        const attackRes = await fetch(`http://localhost:7000/attack/${adventurerId}`, { method: "POST" });
        expect(attackRes.status).toBe(200);

        // 4. Use a healing potion
        const healRes = await fetch(`http://localhost:7000/heal/${adventurerId}`, { method: "POST" });
        expect(healRes.status).toBe(200);
    });
});
