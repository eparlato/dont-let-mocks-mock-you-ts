import { Adventurer } from './adventurer.js';

export interface AdventurerRepository {
    save(adventurer: Adventurer): void;
    findById(id: string): Adventurer | undefined;
    update(adventurer: Adventurer): void;
    delete(id: string): void;
}
