export class CH5KeypadUtils {

  public static readonly KEYPAD_BUTTON_KEY = [
    "button1",
    "button2",
    "button3",
    "button4",
    "button5",
    "button6",
    "button7",
    "button8",
    "button9",
    "buttonstar",
    "button0",
    "buttonhash",
    "buttonextra",
  ];

  public static readonly CONTRACT_SEND_EVENT_ON_CLICK = [
    'Press1',
    'Press2',
    'Press3',
    'Press4',
    'Press5',
    'Press6',
    'Press7',
    'Press8',
    'Press9',
    'PressStar',
    'Press0',
    'PressHash',
    'PressExtraButtton'
  ];

  public static readonly KEYPAD_DEFAULT_VALUES = [
    {
      key: "button1",
      iconClass: "",
      labelMajor: "1",
      labelMinor: "&nbsp;",
      pressed: false,
      index: 0,
      defaultClasses: ['number-btn'],
      sendEventOnClick: ""
    },
    {
      key: "button2",
      iconClass: "",
      labelMajor: "2",
      labelMinor: "ABC",
      pressed: false,
      index: 1,
      defaultClasses: ['number-btn'],
      sendEventOnClick: ""
    },
    {
      key: "button3",
      iconClass: "",
      labelMajor: "3",
      labelMinor: "DEF",
      pressed: false,
      index: 2,
      defaultClasses: ['number-btn'],
      sendEventOnClick: ""
    },
    {
      key: "button4",
      iconClass: "",
      labelMajor: "4",
      labelMinor: "GHI",
      pressed: false,
      index: 3,
      defaultClasses: ['number-btn'],
      sendEventOnClick: ""
    },
    {
      key: "button5",
      iconClass: "",
      labelMajor: "5",
      labelMinor: "JKL",
      pressed: false,
      index: 4,
      defaultClasses: ['number-btn'],
      sendEventOnClick: ""
    },
    {
      key: "button6",
      iconClass: "",
      labelMajor: "6",
      labelMinor: "MNO",
      pressed: false,
      index: 5,
      defaultClasses: ['number-btn'],
      sendEventOnClick: ""
    },
    {
      key: "button7",
      iconClass: "",
      labelMajor: "7",
      labelMinor: "PQRS",
      pressed: false,
      index: 6,
      defaultClasses: ['number-btn'],
      sendEventOnClick: ""
    },
    {
      key: "button8",
      iconClass: "",
      labelMajor: "8",
      labelMinor: "TUV",
      pressed: false,
      index: 7,
      defaultClasses: ['number-btn'],
      sendEventOnClick: ""
    },
    {
      key: "button9",
      iconClass: "",
      labelMajor: "9",
      labelMinor: "WXYZ",
      pressed: false,
      index: 8,
      defaultClasses: ['number-btn'],
      sendEventOnClick: ""
    },
    {
      key: "buttonstar",
      iconClass: "",
      labelMajor: "*",
      labelMinor: "",
      pressed: false,
      index: 9,
      defaultClasses: ['misc-btn', 'misc-btn-one'],
      sendEventOnClick: ""
    },
    {
      key: "button0",
      iconClass: "",
      labelMajor: "0",
      labelMinor: "+",
      pressed: false,
      index: 10,
      defaultClasses: ['number-btn'],
      sendEventOnClick: ""
    },
    {
      key: "buttonhash",
      iconClass: "",
      labelMajor: "#",
      labelMinor: "",
      pressed: false,
      index: 11,
      defaultClasses: ['misc-btn', 'misc-btn-two'],
      sendEventOnClick: ""
    },
    {
      key: "buttonextra",
      iconClass: "fas fa-phone",
      labelMajor: "",
      labelMinor: "",
      pressed: false,
      index: 12,
      defaultClasses: ['extra-btn'],
      sendEventOnClick: ""
    },
  ];
}