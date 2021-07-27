import {PROPERTIES_INTERFACE} from "../../utils";
import {getCrComLibComponent} from "../headless-browser";

export const VERSION = '1.0.0';

export const GET_PROPERTIES = async (): Promise<PROPERTIES_INTERFACE> => {
  const CrComLibHelper = await getCrComLibComponent('Ch5OverlayPanel');
  return {
    POSITION_OFFSET: {
      values: CrComLibHelper.POSITION_OFFSETS,
      key: 'position_offset',
      classListPrefix: 'ch5-overlay-panel--'
    },
    STRETCH: {
      values: CrComLibHelper.STRETCHES,
      key: 'stretch',
      classListPrefix: 'ch5-overlay-panel--'
    },
    OVERFLOW: {
      values: CrComLibHelper.OVERFLOWS,
      key: 'overflow',
      classListPrefix: 'ch5-overlay-panel--'
    }
  }
};
