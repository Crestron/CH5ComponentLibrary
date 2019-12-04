// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

// tslint:disable-next-line:ban-types
const initialTicks: Function[] = [];
// tslint:disable-next-line:ban-types
const preTicks: Function[] = [];
// tslint:disable-next-line:ban-types
const ticks: Function[] = [];
let running = false;

// tslint:disable-next-line:ban-types
export function AddInitialTick(fn: Function): void {
	initialTicks.push(fn);
	run();
}

// tslint:disable-next-line:ban-types
export function AddPreTick(fn: Function): void {
	preTicks.push(fn);
	run();
}

// tslint:disable-next-line:ban-types
export function AddTick(fn: Function): void {
	ticks.push(fn);
	run();
}

function run(): void {
	if (running) {
		return;
	}

	running = true;
	tick();
}

function tick(): void {
	initialTicks.forEach(fn => fn());
	preTicks.forEach(fn => fn());
	ticks.forEach(fn => fn());
	requestAnimationFrame(tick);
}