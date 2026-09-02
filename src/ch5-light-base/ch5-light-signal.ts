import { Ch5Signal, Ch5SignalBridge, Ch5SignalFactory } from "../ch5-core";

/** Signal value kinds supported by the light signal helper. */
export type TCh5LightSignalType = 'string' | 'number' | 'boolean';

interface ICh5LightSignalSubscription {
	signalName: string;
	signalType: TCh5LightSignalType;
	subKey: string;
}

/**
 * Ultra-light, reusable signal-subscription helper for the "light" family.
 *
 * Rule 1 - imports ONLY `Ch5Signal` / `Ch5SignalFactory`; no lodash, `Ch5Property`
 * or `Ch5Common`, so it avoids the heavy per-instance machinery the light
 * components were built to skip.
 *
 * Rule 4 - a thin generic surface (`subscribe` / `unsubscribeAll`) covering
 * string / number / boolean signals, so a component can add another
 * `receiveState*` attribute in 2-3 lines instead of bespoke subscribe methods.
 *
 * Stays cheap for signal-free components: the subscription list is created lazily
 * on first `subscribe` and callbacks are passed in at subscribe time (never a
 * pre-allocated field), so a component that never subscribes allocates nothing.
 */
export class Ch5LightSignal {

	/** Lazily created — stays `null` until the first successful subscription. */
	private _subscriptions: ICh5LightSignalSubscription[] | null = null;

	/**
	 * Subscribes to a Crestron signal by name (released by {@link unsubscribeAll}).
	 * `onValue` fires with the current value immediately (behaviour-subject) and on
	 * every change. No-op if `signalName` is falsy or the signal can't be resolved.
	 */
	public subscribe<T extends string | number | boolean>(
		signalName: string,
		signalType: TCh5LightSignalType,
		onValue: (value: T) => void
	): void {
		if (!signalName) {
			return;
		}
		const subSigName = Ch5Signal.getSubscriptionSignalName(signalName);
		const csf = Ch5SignalFactory.getInstance();

		let subKey = '';
		if (signalType === 'number') {
			const signal = csf.getNumberSignal(subSigName);
			if (signal === null) { return; }
			subKey = signal.subscribe(onValue as (value: number) => void);
		} else if (signalType === 'boolean') {
			const signal = csf.getBooleanSignal(subSigName);
			if (signal === null) { return; }
			subKey = signal.subscribe(onValue as (value: boolean) => void);
		} else {
			const signal = csf.getStringSignal(subSigName);
			if (signal === null) { return; }
			subKey = signal.subscribe(onValue as (value: string) => void);
		}

		(this._subscriptions ??= []).push({ signalName, signalType, subKey });
	}

	/**
	 * Publishes a PLAIN boolean to a Crestron signal (send/event direction), using the
	 * RAW signal name and a plain `publish` (NOT the repeat-digital object form). Use
	 * this for plain momentary/level digital sends such as the base's `sendEventOnShow`
	 * (mirrors `Ch5Common.sendShowSignal`). No-op on a falsy/unresolved name. Stateless,
	 * so it's safe on a fresh instance.
	 */
	public sendBoolean(signalName: string, value: boolean): void {
		if (!signalName) {
			return;
		}
		const signal = Ch5SignalFactory.getInstance().getBooleanSignal(signalName);
		if (signal !== null) {
			signal.publish(value);
		}
	}

	/**
	 * Publishes a PLAIN number to a Crestron signal (send/event direction), using the
	 * RAW signal name and a plain `publish`. Used for numeric list-contract sends such
	 * as the button-list's `ListItemClicked` / `ListItemHeld`. No-op on a
	 * falsy/unresolved name. Stateless, so it's safe on a fresh instance.
	 */
	public sendNumber(signalName: string, value: number): void {
		if (!signalName) {
			return;
		}
		const signal = Ch5SignalFactory.getInstance().getNumberSignal(signalName);
		if (signal !== null) {
			signal.publish(value);
		}
	}

	/**
	 * Publishes a boolean to a Crestron signal in the REPEAT-DIGITAL object form
	 * (`{ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value }`) via the object-as-boolean
	 * signal, exactly like `ch5-button` / `ch5-image` / `ch5-dpad` do for their
	 * `sendEventOnClick`. Use this (instead of {@link sendBoolean}) for held-button
	 * click sends that support repeat-digital, so the control system handles the
	 * auto-repeat identically to the heavy components. No-op on a falsy/unresolved
	 * name. Stateless, so it's safe on a fresh instance.
	 */
	public sendRepeatDigital(signalName: string, value: boolean): void {
		if (!signalName) {
			return;
		}
		const signal = Ch5SignalFactory.getInstance().getObjectAsBooleanSignal(signalName);
		if (signal !== null) {
			signal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
		}
	}

	/** `true` while at least one subscription is active. */
	public get hasSubscriptions(): boolean {
		return this._subscriptions !== null && this._subscriptions.length > 0;
	}

	/** `true` while a subscription for the given signal name is active. */
	public isSubscribedTo(signalName: string): boolean {
		if (this._subscriptions === null || !signalName) {
			return false;
		}
		for (let i = 0; i < this._subscriptions.length; i++) {
			if (this._subscriptions[i].signalName === signalName) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Releases the subscription(s) for one signal name, leaving others intact, so a
	 * component with several `receiveState*` signals can tear one down without
	 * disturbing the rest. Safe when the name isn't subscribed.
	 */
	public unsubscribe(signalName: string): void {
		if (this._subscriptions === null || !signalName) {
			return;
		}
		for (let i = this._subscriptions.length - 1; i >= 0; i--) {
			const sub = this._subscriptions[i];
			if (sub.signalName !== signalName) {
				continue;
			}
			this._release(sub);
			this._subscriptions.splice(i, 1);
		}
		if (this._subscriptions.length === 0) {
			this._subscriptions = null;
		}
	}

	/**
	 * Releases every subscription and clears the list (back to the zero-allocation
	 * state). Safe when nothing is subscribed.
	 */
	public unsubscribeAll(): void {
		if (this._subscriptions === null) {
			return;
		}
		for (let i = 0; i < this._subscriptions.length; i++) {
			this._release(this._subscriptions[i]);
		}
		this._subscriptions = null;
	}

	/** Releases a single tracked subscription from its Crestron signal. */
	private _release(sub: ICh5LightSignalSubscription): void {
		const csf = Ch5SignalFactory.getInstance();
		const subSigName = Ch5Signal.getSubscriptionSignalName(sub.signalName);
		if (sub.signalType === 'number') {
			const signal = csf.getNumberSignal(subSigName);
			if (signal !== null) { signal.unsubscribe(sub.subKey); }
		} else if (sub.signalType === 'boolean') {
			const signal = csf.getBooleanSignal(subSigName);
			if (signal !== null) { signal.unsubscribe(sub.subKey); }
		} else {
			const signal = csf.getStringSignal(subSigName);
			if (signal !== null) { signal.unsubscribe(sub.subKey); }
		}
	}
}
