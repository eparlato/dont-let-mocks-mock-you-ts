import { MissingWeaponException } from './exception/missing-weapon-exception.js';
import { Weapon } from './weapon.js';

export class DamageCalculatorService {
    getDamage(attack: number, weapons: Weapon[], defense: number): number {
        if (weapons.length === 0) {
            throw new MissingWeaponException();
        }

        const damageWithWeapon = weapons.reduce((sum, weapon) => {
            switch (weapon) {
                case Weapon.AXE:
                case Weapon.SWORD:
                    return sum + 3;
                case Weapon.CLUB:
                    return sum + 1;
                case Weapon.DAGGER:
                    return sum + 2;
            }
        }, 0);

        return Math.max(attack + damageWithWeapon - defense, 0);
    }
}
