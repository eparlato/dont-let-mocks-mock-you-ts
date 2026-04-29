import { Encounter } from './encounter.js';

export interface EncounterRepository {
    save(encounter: Encounter): void;
    findById(id: string): Encounter | undefined;
    findByAdventurerId(id: string): Encounter | undefined;
    update(encounter: Encounter): void;
    delete(id: string): void;
}
