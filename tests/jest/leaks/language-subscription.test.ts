/**
 * Leak guard — base-class subscriptions are released on teardown.
 *
 * BEFORE (master): src/ch5-common/ch5-common.ts:756 subscribed to the
 * language-change signal in the constructor and discarded the returned
 * subscription key. The subscription closure captured `this` (the
 * component) AND `this.translatableObjects`, so every component
 * instance was pinned in memory for the lifetime of the page — even
 * after removal from the DOM.
 *
 * AFTER (this branch): the returned key is stored in
 * `_languageChangeSubKey` and `unsubscribeFromSignals()` calls
 * `signal.unsubscribe(key)`. Future genuine-RxJS subscriptions can
 * additionally use `_baseClassSubscriptions[]`.
 *
 * The test deliberately bypasses the Ch5Common constructor (which would
 * otherwise need the full signal bridge, customElements registration,
 * and a host document). It exercises the teardown logic by calling
 * `unsubscribeFromSignals()` against a synthetic `this`.
 */
import { Ch5Common } from '../../../src/ch5-common/ch5-common';
import { Ch5SignalFactory, languageChangedSignalName } from '../../../src/ch5-core';
import { Subject, Subscription } from 'rxjs';

const protoFn = (name: 'unsubscribeFromSignals'): (this: unknown) => void =>
  (Ch5Common.prototype as unknown as Record<string, (this: unknown) => void>)[name];

const baseFakeThis = (): Record<string, unknown> => ({
  _keepListeningOnSignalsAfterRemoval: false,
  _languageChangeSubKey: '',
  _baseClassSubscriptions: [] as Subscription[],
  _receiveStateEnable: '',
  _subKeySigReceiveEnable: '',
  _receiveStateShow: '',
  _subKeySigReceiveShow: '',
  _receiveStateShowPulse: '',
  _subKeySigReceiveShowPulse: '',
  _receiveStateHidePulse: '',
  _subKeySigReceiveHidePulse: '',
  _receiveStateCustomStyle: '',
  _subKeySigReceiveCustomStyle: '',
  _receiveStateCustomClass: '',
  _subKeySigReceiveCustomClass: '',
  clearBooleanSignalSubscription: () => undefined,
  clearStringSignalSubscription: () => undefined,
});

describe('Ch5Common base-class subscriptions are released on teardown', () => {
  beforeEach(() => {
    // Clear any cached signals from previous tests
    (Ch5SignalFactory.getInstance() as unknown as { _ch5Signals: Record<string, unknown> })._ch5Signals = {};
  });

  it('unsubscribeFromSignals() unsubscribes the tracked language-change subKey via Ch5Signal.unsubscribe', () => {
    // Spin up a real language-change signal so the unsubscribe call has
    // something to find. Subscribe to bump the subKey counter, then assert
    // the teardown path drains it via the bridge API.
    const sig = Ch5SignalFactory.getInstance().getStringSignal(languageChangedSignalName, true);
    expect(sig).not.toBeNull();
    const key = sig!.subscribe(() => undefined);
    expect(typeof key).toBe('string');
    expect(key.length).toBeGreaterThan(0);

    const unsubSpy = jest.spyOn(sig!, 'unsubscribe');

    const fakeThis = { ...baseFakeThis(), _languageChangeSubKey: key };
    protoFn('unsubscribeFromSignals').call(fakeThis);

    expect(unsubSpy).toHaveBeenCalledWith(key);
    expect(fakeThis._languageChangeSubKey).toBe('');
  });

  it('drains _baseClassSubscriptions for non-bridge RxJS subscriptions', () => {
    const subject = new Subject<string>();
    const sub = subject.subscribe(() => undefined);
    expect(sub.closed).toBe(false);

    const fakeThis = { ...baseFakeThis(), _baseClassSubscriptions: [sub] };
    protoFn('unsubscribeFromSignals').call(fakeThis);

    expect(sub.closed).toBe(true);
    expect(fakeThis._baseClassSubscriptions).toEqual([]);
  });

  it('releases the language sub even when _keepListeningOnSignalsAfterRemoval is true', () => {
    // The flag exists to keep receive-state bridge subscriptions alive for
    // re-attachment. It must NOT keep the language-change sub alive — that
    // closure holds the component reference and leaks it forever.
    const sig = Ch5SignalFactory.getInstance().getStringSignal(languageChangedSignalName, true);
    const key = sig!.subscribe(() => undefined);
    const unsubSpy = jest.spyOn(sig!, 'unsubscribe');

    const fakeThis = {
      ...baseFakeThis(),
      _keepListeningOnSignalsAfterRemoval: true,
      _languageChangeSubKey: key,
    };
    protoFn('unsubscribeFromSignals').call(fakeThis);

    expect(unsubSpy).toHaveBeenCalledWith(key);
    expect(fakeThis._languageChangeSubKey).toBe('');
  });

  it('is a no-op when nothing is tracked', () => {
    const fakeThis = baseFakeThis();
    expect(() => protoFn('unsubscribeFromSignals').call(fakeThis)).not.toThrow();
  });
});
