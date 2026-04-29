import { Monster } from './monster.js';

export interface Encounter {
    readonly id: string;
    readonly adventurerId: string;
    readonly monster: Monster;
}
