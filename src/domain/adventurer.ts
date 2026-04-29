import { Weapon } from './weapon.js';

export interface Adventurer {
    readonly id: string | null;
    readonly name: string;
    readonly weapons: Weapon[];
    readonly hp: number;
    readonly attack: number;
    readonly defense: number;
    readonly money: number;
    readonly numberOfPotions: number;
}
