// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Utility function that counts number of CH5 Components
 */
export function countNumberOfCh5Components(parentElement: any) {
	const found: any = { 'parent': parentElement.tagName, 'total': 0 };
	const allElements = parentElement.getElementsByTagName('*'); // live

	for (const element of allElements) {
		const elementTagName = element.tagName;
		if (elementTagName.startsWith('CH5-')) {
			found.total++;
			const priorFoundForTagName: any = found[elementTagName];
			priorFoundForTagName === undefined ? found[elementTagName] = 1 : found[elementTagName] = priorFoundForTagName + 1;
		}
		else { // not starts with 'ch5-'
			if (element.hasAttributes()) {
				const attrs = element.attributes;
				for (let idx = attrs.length - 1; idx >= 0; idx--) {
					const attrName = attrs[idx].name;
					if (attrName.startsWith('data-ch5') && attrName !== 'data-ch5-id'
						&& !attrName.endsWith('subs-key') && !attrName.endsWith('sub-key')) {
						found.total++;
						const priorFoundForAttrName = found[attrName];
						priorFoundForAttrName === undefined ?
							found[attrName] = 1 :
							found[attrName] = priorFoundForAttrName + 1;
					}
				}
			}
		}
	}
	return found;
}