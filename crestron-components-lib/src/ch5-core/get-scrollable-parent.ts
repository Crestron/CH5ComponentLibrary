// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Utility function that returns the first scrollable parent
 */
export function getScrollableParent(node: HTMLElement): HTMLElement {
    const regex = /(auto|scroll)/;
    const parents: any = (_node: HTMLElement, ps: any) => {
        if (_node.parentNode === null) { return ps; }
        return parents(_node.parentNode, ps.concat([_node]));
    };

    const style = (_node: HTMLElement, prop: string) => getComputedStyle(_node, null).getPropertyValue(prop);
    const overflow = (_node: HTMLElement) => style(_node, 'overflow') + style(_node, 'overflow-y') + style(_node, 'overflow-x');
    const scroll = (_node: HTMLElement) => regex.test(overflow(_node));

    /* eslint-disable consistent-return */
    const scrollParent = (_node: any) => {
        if (!(_node instanceof HTMLElement || _node instanceof SVGElement)) {
            return;
        }

        const parentNodes = parents(_node.parentNode, []);

        for (const parent of parentNodes) {
            if (scroll(parent)) {
                return parent;
            }
        }

        return document.scrollingElement || document.documentElement;
    };

    return scrollParent(node);
    /* eslint-enable consistent-return */
}