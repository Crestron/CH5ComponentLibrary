import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { TCh5SliderButtonKey,  }from './t-ch5-slider-button';

/**
 * @ignore
 */
export interface ICh5SliderButtonAttributes  {
  /**
        * @documentation
        * [
        * "`key` attribute",
        * "***",
        * "Used to set the type of button i.e on ,off"
        * ]
        * @name key
        * @default on
        * @attributeType "EnumeratedValue"
        */
        key: TCh5SliderButtonKey;
        
}