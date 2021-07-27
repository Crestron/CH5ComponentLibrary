import {PROPERTIES_INTERFACE} from "../../utils";
import {getCrComLibComponent} from "../headless-browser";

export const VERSION = '1.0.0';

export const GET_PROPERTIES = async (): Promise<PROPERTIES_INTERFACE> => {
  const CrComLibHelper = await getCrComLibComponent('Ch5Slider');
  return {
    ORIENTATIONS: {
      values: CrComLibHelper.ORIENTATIONS,
      key: 'orientation',
      classListPrefix: 'ch5-slider--'
    },
    SHAPES: {
      values: CrComLibHelper.SHAPES,
      key: 'shape',
      classListPrefix: 'ch5-slider--'
    },
    SIZES: {
      values: CrComLibHelper.SIZES,
      key: 'size',
      classListPrefix: 'ch5-slider--size-'
    },
    STRETCH: {
      values: CrComLibHelper.STRETCHES,
      key: 'stretch',
      classListPrefix: 'ch5-slider--'
    },
    DIRECTION: {
      values: CrComLibHelper.DIRECTION,
      key: 'direction',
      classListPrefix: 'ch5-slider--'
    },
    TOOLTIPS: {
      values: CrComLibHelper.TOOLTIPS,
      key: 'tooltip',
      classListPrefix: 'ch5-slider--'
    },
    TDISPLAY: {
      values: CrComLibHelper.TDISPLAY,
      key: 'tdisplay',
      classListPrefix: 'ch5-slider--'
    },
  }
}
