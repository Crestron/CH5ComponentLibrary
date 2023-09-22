/* eslint-disable @typescript-eslint/ban-types */
// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

const initialTicks: Function[] = [];
const preTicks: Function[] = [];
const ticks: Function[] = [];
let running = false;

export function AddInitialTick(fn: Function): void {
	initialTicks.push(fn);
	run();
}

export function AddPreTick(fn: Function): void {
	preTicks.push(fn);
	run();
}

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