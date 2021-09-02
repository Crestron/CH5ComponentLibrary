// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export interface ICh5KeypadBtnAttributes {
    
    /**
     * @documentation
     * [
     * "`labelMajor` attribute",
     * "***",
     * "Defines the primary/minor text value of the button."
     * ]
     * @name labelMajor
     */
     labelMajor: string;
    
     /**
      * @documentation
      * [
      * "`labelMinor` attribute",
      * "***",
      * "Defines the secondary/minor text value of the button."
      * ]
      * @name labelMinor
      */
      labelMinor: string;

      /**
       * @documentation
       * [
       * "`sendeventonclick` attribute",
       * "***",
       * "Sends an event on click or tap (mouse or swipe up and down quickly).",
       * "Use this when the control system takes an action on the rising edge from false to true of a boolean digital event.",
       * "Examples include the SIMPL Logic Symbol for Toggle a with description of ",
       * "Digital input <clock> 'High/1 (rising edge) = Toggle; Low/0 = No effect'."
       * ]
       * @name sendeventonclick
       */
      sendEventOnClick: string;
}