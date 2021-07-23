import {PROPERTIES_INTERFACE} from "../../utils";
import {getCrComLibComponent} from "../headless-browser";

export const VERSION = '1.0.0';

export const GET_PROPERTIES = async (): Promise<PROPERTIES_INTERFACE> => {
  const CrComLibHelper = await getCrComLibComponent('Ch5Button');
  return {
    ORIENTATIONS: {
      values: CrComLibHelper.ORIENTATIONS,
      key: 'orientation',
      classListPrefix: 'ch5-button--'
    },
    SHAPES: {
      values: CrComLibHelper.SHAPES,
      key: 'shape',
      classListPrefix: 'ch5-button--'
    },
    SIZES: {
      values: CrComLibHelper.SIZES,
      key: 'size',
      classListPrefix: 'ch5-button--size-'
    },
    STRETCH: {
      values: CrComLibHelper.STRETCHES,
      key: 'stretch',
      classListPrefix: 'ch5-button--'
    },
    TYPES: {
      values: CrComLibHelper.TYPES,
      key: 'type',
      classListPrefix: 'ch5-button--'
    },
  }
}
