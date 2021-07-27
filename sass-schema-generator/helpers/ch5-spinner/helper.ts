import {PROPERTIES_INTERFACE} from "../../utils";
import {getCrComLibComponent} from "../headless-browser";

export const VERSION = '1.0.0';

export const GET_PROPERTIES = async (): Promise<PROPERTIES_INTERFACE> => {
  const CrComLibHelper = await getCrComLibComponent('Ch5Spinner');
  return {
    FEEDBACKMODES: {
      values: CrComLibHelper.FEEDBACKMODES,
      key: 'feedbackmodes',
      classListPrefix: 'ch5-spinner--'
    },
    ICONPOSITIONS: {
      values: CrComLibHelper.ICONPOSITIONS,
      key: 'iconposition',
      classListPrefix: 'ch5-spinner--'
    }
  }
}
