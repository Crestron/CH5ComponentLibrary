// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5ListAbstractHelper } from "./ch5-list-abstract-helper";

export interface ICh5ListBufferedItems {
	bufferActive: boolean;
	bufferingComplete: boolean;
	bufferForwardStartIndex: number;
	forwardBufferedItems: HTMLElement[];
	bufferBackwardsStartIndex: number;
	backwardsBufferedItems: HTMLElement[];
}

export class Ch5ListBufferedItems extends Ch5ListAbstractHelper {

	public bufferItems(skipForward?: boolean, skipBackwards?: boolean): void {
		if (typeof skipForward !== 'boolean') {
			skipForward = false;
		}
		if (typeof skipBackwards !== 'boolean') {
			skipBackwards = false;
		}
		if (!this._list.bufferedItems.bufferActive) {
			return;
		}
		const size: number = Number(this._list.size);
		if (!skipForward && this._list.bufferedItems.bufferForwardStartIndex <= size &&
			this._list.bufferedItems.forwardBufferedItems.length === 0 && // avoid first buffered items duplication
			this._list.bufferedItems.bufferForwardStartIndex <= this._list.bufferedItems.bufferBackwardsStartIndex + this._list.getFirstRenderVisibleItemsNr()) {
			// normal/forward buffer
			this._bufferItemsForward();
		}

		// TODO: handle endless list where we can have buffered items before first list item
		if (this._list.endless) {
			if (!skipBackwards && this._list.bufferedItems.bufferBackwardsStartIndex > 0 &&
				this._list.bufferedItems.backwardsBufferedItems.length === 0 && // avoid first buffered items duplication
				this._list.bufferedItems.bufferBackwardsStartIndex > this._list.bufferedItems.bufferForwardStartIndex) {
				this._bufferItemsBackwards();
			}
		}

		// check if buffering is complete, all items are loaded
		this._list.bufferedItems.bufferingComplete = this._list.bufferedItems.bufferForwardStartIndex > size ||
			this._list.bufferedItems.bufferForwardStartIndex - 1 === this._list.bufferedItems.bufferBackwardsStartIndex ||
			this._list.bufferedItems.bufferBackwardsStartIndex === 0;
	}

	public _appendForwardBufferedItemsToList(currentScrollPos: number, verticalDir: boolean, itemSizeOffset: number): void {
		if (this._list.bufferedItems.forwardBufferedItems.length > 0) {
			const bufferListFragment = document.createDocumentFragment();
			this._list.bufferedItems.forwardBufferedItems = this._list.bufferedItems.forwardBufferedItems.reverse();
			let item = this._list.bufferedItems.forwardBufferedItems.pop();
			while (typeof item !== 'undefined') {
				bufferListFragment.appendChild(item);
				item = this._list.bufferedItems.forwardBufferedItems.pop();
				this._list.appendPosition++
			}

			this._list.divList.insertBefore(bufferListFragment, this._list.divList.children[this._list.appendPosition]);

			// temporarily disabled because scroll is replaced by gestures
			// if (this._bufferedItems.bufferingComplete
			//     && this.endless && this._bufferedItems.backwardsBufferedItems.length > 0) {
			//     // if endless is active, all items were buffered and you scroll to the end of the list
			//     // you have to make sure your buffered items (on the other side, backwards) were added to the list;
			//     // otherwise the items order will be messed up
			//     this._appendBackwardsBufferedItemsToList(currentScrollPos, verticalDir, itemSizeOffset);
			// }

			// set next buffered items
			this.bufferItems(false, true);
			this._list.onResizeList();
		}
	}

	public maybeAddBufferItems(newPosition: number) {
		if (this._list.bufferAmount !== null &&
			this._list.bufferAmount > 0
		) {
			const maxOffset = (this._list.items.length - this._list.getItemsPerPage()) * this._list.getItemSize();
			const isLtr = this._list.isLtr();
			// if drag orientation is to left and drag position is in the last page of items then append forward buffer items
			if ((isLtr && newPosition < -maxOffset)
				|| (!isLtr && newPosition < maxOffset)
			) {
				this._appendForwardBufferedItemsToList(
					newPosition,
					!this._list.isHorizontal,
					this._list.bufferAmount
				);
			}

		}
	}

	private _bufferItemsForward() {
		const size: number = Number(this._list.size);
		const uid: string = this._list.divList.id;
		const listChildrenLength = this._list.divList.children.length;
		const bufferAmountValue = Number(this._list.bufferAmount);

		let lastBufferedIndex: number = listChildrenLength + bufferAmountValue;

		if (lastBufferedIndex > size) {
			lastBufferedIndex = size;
		}

		for (let index = listChildrenLength; index < lastBufferedIndex; index++) {
			const item = this._list.templateHelper.processTemplate(uid, index, this._list.templateVars);
			this._list.bufferedItems.forwardBufferedItems.push(item);
		}

		// prepare next buffer start
		this._list.bufferedItems.bufferForwardStartIndex = lastBufferedIndex + 1;
	}

	private _bufferItemsBackwards() {
		const uid: string = this._list.divList.id;

		let lastBufferedIndex: number = this._list.bufferedItems.bufferBackwardsStartIndex - Number(this._list.bufferAmount);
		if (lastBufferedIndex < this._list.bufferedItems.bufferForwardStartIndex) {
			lastBufferedIndex = this._list.bufferedItems.bufferForwardStartIndex - 1;
		}
		if (lastBufferedIndex < 0) {
			lastBufferedIndex = 0;
		}

		for (let index = this._list.bufferedItems.bufferBackwardsStartIndex; index > lastBufferedIndex; index--) {
			this._list.bufferedItems.backwardsBufferedItems.push(this._templateHelper.processTemplate(uid, index, this._list.templateVars));
		}

		// prepare next buffer start (backwards direction)
		this._list.bufferedItems.bufferBackwardsStartIndex = lastBufferedIndex;
	}

	private _appendBackwardsBufferedItemsToList(currentScrollPos: number, verticalDir: boolean, itemSizeOffset: number) {
		if (this._list.bufferedItems.backwardsBufferedItems.length > 0) {
			const bufferListFragment = document.createDocumentFragment();
			// this._bufferedItems.backwardsBufferedItems = this._bufferedItems.backwardsBufferedItems.reverse();
			let item = this._list.bufferedItems.backwardsBufferedItems.pop();
			while (typeof item !== 'undefined') {
				bufferListFragment.appendChild(item);
				item = this._list.bufferedItems.backwardsBufferedItems.pop();
				// update scroll position
				// TODO: this is not working yet
				if (verticalDir) {
					this._list.divList.scrollTop = itemSizeOffset + currentScrollPos;
				} else {
					this._list.divList.scrollLeft = itemSizeOffset + currentScrollPos;
				}
			}

			this._list.divList.insertBefore(bufferListFragment, this._list.divList.children[this._list.appendPosition]);

			// temporarily disabled because scroll is replaced by gestures
			// if (this._bufferedItems.bufferingComplete
			//     && this.endless && this._bufferedItems.forwardBufferedItems.length > 0) {
			//     // if endless is active, all items were buffered and you scroll back to beginning of the list
			//     // you have to make sure your buffered items (on the other side, forward) were added to the list;
			//     // otherwise the items order will be messed up
			//     this._appendForwardBufferedItemsToList(currentScrollPos, verticalDir, itemSizeOffset);
			// }

			// set next buffered items
			this.bufferItems(true, false);
			this._list.onResizeList();
		}
	}
}
