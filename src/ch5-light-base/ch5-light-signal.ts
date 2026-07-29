import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";

/** Signal value kinds supported by the light signal helper. */
export type TCh5LightSignalType = 'string' | 'number' | 'boolean';

interface ICh5LightSignalSubscription {
	signalName: string;
	signalType: TCh5LightSignalType;
	subKey: string;
}

/**
 * Ultra-light, reusable signal-subscription helper for the "light" component
 * family.
 *
 * Rule 1 — it imports ONLY `Ch5Signal` / `Ch5SignalFactory`; it deliberately
 * pulls in no lodash, no `Ch5Property`, and no `Ch5Common`, so it does not drag
 * the heavy per-instance machinery the light components were built to avoid.
 *
 * Rule 4 — it exposes a thin generic surface (`subscribe` / `unsubscribeAll`)
 * that works for string / number / boolean signals, so a light component can
 * add another `receiveState*` attribute in 2–3 lines instead of hand-writing a
 * new set of subscribe/unsubscribe methods per attribute.
 *
 * It stays cheap for signal-free components: the internal subscription list is
 * created lazily on the first `subscribe`, and each subscription callback is
 * supplied by the caller at subscribe time (never allocated up-front as a field).
 * A component that never subscribes therefore allocates nothing here.
 */
export class Ch5LightSignal {

	/** Lazily created — stays `null` until the first successful subscription. */
	private _subscriptions: ICh5LightSignalSubscription[] | null = null;

	/**
	 * Subscribes to a Crestron signal by name and returns nothing; the tracked
	 * subscription is released later by {@link unsubscribeAll}. `onValue` is
	 * invoked with the signal's current value immediately (behaviour-subject
	 * semantics) and on every subsequent change. A falsy `signalName`, or a
	 * signal that cannot be resolved, is a no-op.
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
	 * Releases the subscription(s) for a single signal name, leaving any other
	 * subscriptions intact. Lets a component that holds several `receiveState*`
	 * signals tear one down without disturbing the others. Safe when the name is
	 * not subscribed.
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
	 * Releases every active subscription and clears the internal list (back to
	 * the zero-allocation state). Safe to call when nothing is subscribed.
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
