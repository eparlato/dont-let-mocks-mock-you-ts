import { Adventurer } from '../../src/domain/adventurer.js';
import { AdventurerRepository } from '../../src/domain/adventurer-repository.js';

export class InMemoryAdventurerRepository implements AdventurerRepository {
    private readonly store = new Map<string, Adventurer>();

    save(adventurer: Adventurer): void {
        this.store.set(adventurer.id!, adventurer);
    }

    findById(id: string): Adventurer | undefined {
        return this.store.get(id);
    }

    update(adventurer: Adventurer): void {
        this.store.set(adventurer.id!, adventurer);
    }

    delete(id: string): void {
        this.store.delete(id);
    }
}
