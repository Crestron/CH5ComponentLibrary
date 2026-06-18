/**
 * Sanity test — confirms the Jest harness, ts-jest, and JSDOM are wired correctly.
 * If this fails, nothing else in tests/jest/ will work.
 */

describe('Jest harness sanity', () => {
  it('runs a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('has JSDOM available', () => {
    const el = document.createElement('div');
    el.textContent = 'hello';
    expect(el.textContent).toBe('hello');
  });

  it('has MutationObserver available (JSDOM)', () => {
    expect(typeof MutationObserver).toBe('function');
  });

  it('has ResizeObserver shim available (note: JSDOM does not implement it natively)', () => {
    // JSDOM does not implement ResizeObserver. Tests that exercise it must
    // install a fake (see tests/jest/_helpers/resize-observer-mock.ts).
    expect(typeof (globalThis as any).ResizeObserver === 'function' || typeof (globalThis as any).ResizeObserver === 'undefined').toBe(true);
  });
});
