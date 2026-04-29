import { Encounter } from '../../src/domain/encounter.js';
import { EncounterRepository } from '../../src/domain/encounter-repository.js';

export class InMemoryEncounterRepository implements EncounterRepository {
    private readonly store = new Map<string, Encounter>();

    save(encounter: Encounter): void {
        this.store.set(encounter.id, encounter);
    }

    findById(id: string): Encounter | undefined {
        return this.store.get(id);
    }

    findByAdventurerId(adventurerId: string): Encounter | undefined {
        for (const encounter of this.store.values()) {
            if (encounter.adventurerId === adventurerId) {
                return encounter;
            }
        }
        return undefined;
    }

    update(encounter: Encounter): void {
        this.store.set(encounter.id, encounter);
    }

    delete(id: string): void {
        this.store.delete(id);
    }
}
