/**
 * Regression guard — ColorPicker no longer swallows initialisation errors.
 *
 * BEFORE (master): a failed `mycolorpicker.hsl(...)` call left `joe = null`
 * with no log, no warning, and no exposed state. Subsequent `setColor()`
 * calls then threw NPEs that were ALSO silently caught. Users saw nothing.
 *
 * AFTER (this branch): the catch emits a console.warn with the picker id
 * and the error. The class exposes `isReady`, and `setColor()` returns a
 * boolean indicating whether the call took effect.
 *
 * We mock `@raghavendradabbir/mycolorpicker` to force a failure path.
 */

jest.mock('@raghavendradabbir/mycolorpicker', () => ({
  hsl: jest.fn(() => {
    throw new Error('simulated picker init failure');
  }),
}));

import { ColorPicker } from '../../../src/ch5-color-picker/color-picker';

describe('ColorPicker silent-catch fix', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });
  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('logs a warning when initialisation fails (instead of swallowing)', () => {
    const div = document.createElement('div');
    div.id = 'cp-1';
    document.body.appendChild(div);

    const cp = new ColorPicker('cp-1', '#ffffff');

    expect(cp.isReady).toBe(false);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const [message, err] = warnSpy.mock.calls[0];
    expect(message).toContain('failed to initialise picker');
    expect(message).toContain('cp-1');
    expect((err as Error).message).toContain('simulated picker init failure');
  });

  it('setColor() returns false and warns when called on an uninitialised picker', () => {
    const cp = new ColorPicker('cp-2', '#ffffff');
    warnSpy.mockClear();

    const result = cp.setColor('#000000');

    expect(result).toBe(false);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain('setColor() called on uninitialised picker');
  });
});
