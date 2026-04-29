import { describe, test } from 'vitest';
import { DiceThrower } from '../../src/domain/dice-thrower.js';

describe('DiceThrowerTest', () => {
    test('rollToHit', () => {
        new DiceThrower().rollToHit();
    });
});
