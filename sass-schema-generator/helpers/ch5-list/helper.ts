import {PROPERTIES_INTERFACE} from "../../utils";
import {getCrComLibComponent} from "../headless-browser";

export const VERSION = '1.0.0';

export const GET_PROPERTIES = async (): Promise<PROPERTIES_INTERFACE> => {
  const CrComLibHelper = await getCrComLibComponent('Ch5List');
  return {
    ORIENTATIONS: {
      values: CrComLibHelper.ORIENTATION,
      key: 'orientation',
      classListPrefix: 'ch5-list--'
    },
  }
};
