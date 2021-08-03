import {PROPERTIES_INTERFACE} from "../../utils";
import {getCrComLibComponent} from "../headless-browser";

export const VERSION = '1.0.0';

export const GET_PROPERTIES = async (): Promise<PROPERTIES_INTERFACE> => {
  const CrComLibHelper = await getCrComLibComponent('Ch5Button');
  return CrComLibHelper.COMPONENT_DATA;
};

export const BUSINESS_RULES = [
  {
    contains: 'iconposition',
    key: 'icon',
    value: true
  },
  {
    contains: 'ios',
    key: 'platform',
    value: 'ios'
  }
];