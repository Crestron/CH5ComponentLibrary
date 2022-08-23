// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * @ignore
 */
export interface ICh5CommonAttributesForDir {

	/**
	 * @documentation
	 * [
	 * "`dir` attribute",
	 * "***",
	 * "An enumerated attribute indicating the directionality of the element's text. It can have the following values:",
	 * "ltr, which means left to right and is to be used for languages that are written from the left to the right (like English) ",
	 * "rtl, which means right to left and is to be used for languages that are written from the right to the left (like Arabic) ",
	 * "auto, which lets the user agent decide. It uses a basic algorithm as it parses the characters inside the element until it ",
	 * "finds a character with a strong directionality then it applies that directionality to the whole element."
	 * ]
	 * @name dir
	 * @attributeType "String"
	 */
	dir: string;

}
