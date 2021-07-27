import {PROPERTIES_INTERFACE} from "../../utils";
import {getCrComLibComponent} from "../headless-browser";

export const VERSION = '1.0.0';

export const GET_PROPERTIES = async (): Promise<PROPERTIES_INTERFACE> => {
  const CrComLibHelper = await getCrComLibComponent('Ch5Toggle');
  return {
    ORIENTATIONS: {
      values: CrComLibHelper.ORIENTATIONS,
      key: 'orientation',
      classListPrefix: 'ch5-toggle--'
    },
    SHAPES: {
      values: CrComLibHelper.SHAPES,
      key: 'shape',
      classListPrefix: 'ch5-toggle--'
    },
    MODES: {
      values: CrComLibHelper.MODES,
      key: 'mode',
      classListPrefix: 'ch5-toggle--'
    }
  }
}
