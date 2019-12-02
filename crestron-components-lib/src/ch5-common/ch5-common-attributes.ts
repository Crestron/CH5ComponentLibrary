// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5ShowType } from "../_interfaces/ch5-common/types/t-ch5-show-type";

/**
 * At the moment this class is only used by the ch5-spinner 
 * to make the Ch5SpinnerAttributes class compatible with the current 
 * interface architecture.
 * 
 * @see Ch5SpinnerAttributes
 */
export class Ch5CommonAttributes {

  public id: string = '';
  
  public customClass: string = '';

  public customStyle: string = '';
  
  public noshowType: TCh5ShowType = 'visibility';
  
  public receiveStateCustomClass: string = '';
  
  public receiveStateCustomStyle: string = '';
  
  public receiveStateShow: string = '';
  
  public receiveStateShowPulse: string = '';
  
  public receiveStateHidePulse: string = '';
  
  public receiveStateEnable: string = '';
  
  public sendEventOnShow: string = '';

  public appendClassWhenInViewPort: string = '';
}