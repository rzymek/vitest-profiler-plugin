import {describe, it, expect, test} from 'vitest';

describe('example', () => {
    it('should pass', () => {
        expect(true).toBe(true);
    });

    describe('sub', () => {
        it('should take</*> some time', () => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(true);
                }, 500);
            });
        });
    });
});
test('no suite', () => {
    expect(true).toBe(true);
})