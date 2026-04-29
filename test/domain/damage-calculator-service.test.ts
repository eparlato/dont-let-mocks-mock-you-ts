import { describe, test, expect } from 'vitest';
import { DamageCalculatorService } from '../../src/domain/damage-calculator-service.js';
import { Weapon } from '../../src/domain/weapon.js';
import { MissingWeaponException } from '../../src/domain/exception/missing-weapon-exception.js';

describe('DamageCalculatorServiceTest', () => {
    test('shouldCalculateAxeDamage', () => {
        const damageCalculator = new DamageCalculatorService();

        const damage = damageCalculator.getDamage(10, [Weapon.AXE], 10);

        expect(damage).toBe(3);
    });

    test('shouldCalculateClubDamage', () => {
        const damageCalculator = new DamageCalculatorService();

        const damage = damageCalculator.getDamage(10, [Weapon.CLUB], 10);

        expect(damage).toBe(1);
    });

    test('shouldCalculateDaggerDamage', () => {
        const damageCalculator = new DamageCalculatorService();

        const damage = damageCalculator.getDamage(10, [Weapon.DAGGER], 10);

        expect(damage).toBe(2);
    });

    test('shouldCalculateTwoDaggersDamage', () => {
        const damageCalculator = new DamageCalculatorService();

        const damage = damageCalculator.getDamage(10, [Weapon.DAGGER, Weapon.DAGGER], 10);

        expect(damage).toBe(4);
    });

    test('shouldCalculateSwordDamage', () => {
        const damageCalculator = new DamageCalculatorService();

        const damage = damageCalculator.getDamage(10, [Weapon.SWORD], 10);

        expect(damage).toBe(3);
    });

    test('shouldThrowWhenNoWeapons', () => {
        const damageCalculator = new DamageCalculatorService();

        expect(() => damageCalculator.getDamage(10, [], 10)).toThrow(MissingWeaponException);
    });
});
