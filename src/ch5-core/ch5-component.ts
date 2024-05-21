import { Ch5BaseClass } from "../ch5-base/ch5-base-class";
import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";

export class Ch5ComponentLibrary {

  public static readonly ROLES: any = {
    Ch5Animation: 'animation',
    Ch5Background: 'region',
    Ch5Button: 'button',
    Ch5ButtonLabel: 'label',
    Ch5ButtonMode: 'template',
    Ch5ButtonModeState: 'template',
    Ch5ButtonList: 'button-list',
    Ch5ButtonListMode: 'template',
    Ch5ButtonListModeState: 'template',
    Ch5ButtonListLabel: 'label',
    Ch5ButtonListIndividualButton: 'template',
    Ch5ColorChip: 'color-chip',
    Ch5ColorPicker: 'color-picker',
    Ch5Dpad: 'dpad',
    Ch5DateTime: 'datetime',
    Ch5DpadChild: 'dpad-child',
    Ch5Keypad: 'keypad',
    Ch5KeypadChild: 'keypad-child',
    Ch5Label: 'label',
    Ch5List: 'list',
    Ch5Form: 'form',
    Ch5Image: 'img',
    Ch5ImportHtmlSnippet: 'template',
    Ch5ModalDialog: 'dialog',
    Ch5OverlayPanel: 'dialog',
    Ch5QrCode: 'qrcode',
    Ch5SegmentedGauge: 'segmented-gauge',
    Ch5SignalLevelGauge: 'signal-level-gauge',
    Ch5Select: 'listbox',
    Ch5SelectOption: 'option',
    Ch5Slider: 'slider',
    Ch5SliderButton: 'slider-button',
    Ch5Spinner: 'listbox',
    Ch5SubpageReferenceList: 'subpage-reference-list',
    Ch5TabButton: 'tab-button',
    Ch5TabButtonIndividualButton: 'template',
    Ch5Template: 'template',
    Ch5Text: "label",
    Ch5TextInput: 'textbox',
    Ch5Toggle: 'switch',
    Ch5TriggerView: 'listbox',
    Ch5TriggerViewChild: 'listbox',
    Ch5Video: 'video',
    Ch5VideoSwitcher: 'video-switcher',
    Ch5VideoSwitcherScreen: 'video-switcher-screen',
    Ch5VideoSwitcherScreenLabel: 'video-switcher-screen-label',
    Ch5VideoSwitcherSource: 'video-switcher-source',
    Ch5VideoSwitcherSourceLabel: 'video-switcher-source-label',
    Ch5WifiSignalLevelGauge: 'wifi-signal-level-gauge'
  };

  // public static registerComponent1(elementName: string, entries: Ch5SignalElementAttributeRegistryEntries, constructor: CustomElementConstructor) {
  //   Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(elementName, entries);
  //   if (typeof window === "object"
  //     && typeof window.customElements === "object"
  //     && typeof window.customElements.define === "function"
  //     && window.customElements.get(elementName) === undefined) {
  //     window.customElements.define(elementName, constructor);
  //   }
  // }

  public static registerComponent(customComponent: typeof Ch5BaseClass) {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(customComponent.ELEMENT_NAME, customComponent.getSignalElementAttributeRegistryEntries(customComponent.COMPONENT_PROPERTIES));
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(customComponent.ELEMENT_NAME) === undefined) {
      window.customElements.define(customComponent.ELEMENT_NAME, customComponent as any);
    }
  }

}