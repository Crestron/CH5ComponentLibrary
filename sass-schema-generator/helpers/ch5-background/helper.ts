import {PROPERTIES_INTERFACE} from "../../utils";
import {getCrComLibComponent} from "../headless-browser";

export const VERSION = '1.0.0';

export const GET_PROPERTIES = async (): Promise<PROPERTIES_INTERFACE> => {
  const CrComLibHelper = await getCrComLibComponent('Ch5Background');
  return {
    SCALE: {
      values: CrComLibHelper.SCALE,
      key: 'scale',
      classListPrefix: 'ch5-background--'
    },
    REPEAT: {
      values: CrComLibHelper.REPEAT,
      key: 'repeat',
      classListPrefix: 'ch5-background--'
    }
  }
};
