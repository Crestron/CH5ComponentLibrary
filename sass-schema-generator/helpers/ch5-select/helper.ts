import {PROPERTIES_INTERFACE} from "../../utils";
import {getCrComLibComponent} from "../headless-browser";

export const VERSION = '1.0.0';

export const GET_PROPERTIES = async (): Promise<PROPERTIES_INTERFACE> => {
  const CrComLibHelper = await getCrComLibComponent('Ch5Select');
  return {
    MODE_VALUES: {
      values: CrComLibHelper.MODE_VALUES,
      key: 'mode_values',
      classListPrefix: 'ch5-select--'
    },
    FEEDBACK_MODE_VALUES: {
      values: CrComLibHelper.FEEDBACK_MODE_VALUES,
      key: 'feedback_mode_values',
      classListPrefix: 'ch5-select--'
    },
  }
};
