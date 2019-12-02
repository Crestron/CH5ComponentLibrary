// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export interface IDebouncerDetails {
  start: number | undefined;
  timeoutIdentifier: any;
}

/**
 * Ensure a funtion will execute just one time in debounceTime time no matter how many times was called
 * @param {IDebouncerDetails} debouncer
 * @param {Function} callback Any function, code specific
 * @param {number} debounceTime Time in milliseconds
 */
export const debounce = (debouncer: IDebouncerDetails, 
                        callback: () => void,
                        debounceTime: number = 0) => { 

  const now: number = Date.now();
  if (!debouncer.start) {
    debouncer.start = now;
  }
  const debounceTimePassed: boolean = now - debouncer.start > debounceTime;
  if (!debouncer.timeoutIdentifier || debounceTimePassed) {
    // set timeout only if debouncer is not init or debounceTime passed
    clearTimeout(debouncer.timeoutIdentifier);
    debouncer.timeoutIdentifier = setTimeout(() => callback(), debounceTime);
    // update debouncer start in case a new callback exec is scheduled
    debouncer.start = debounceTimePassed ? now : debouncer.start;
  }
}  
