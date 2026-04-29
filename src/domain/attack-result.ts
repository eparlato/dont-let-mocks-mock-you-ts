import { Adventurer } from './adventurer.js';
import { Monster } from './monster.js';

export interface AttackResult {
    readonly actions: string[];
    readonly updatedAdventurer: Adventurer;
    readonly updatedMonster: Monster;
}
