import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5LegacyMediaPlayerIconButton } from "./ch5-legacy-media-player-icon-button-base.ts";
import { MusicPlayerLib, subscribeState } from "../ch5-core/index.ts";
// import { debounce } from "lodash";
export class Ch5LegacyMediaPlayerMyMusic extends Ch5Log {

  //#region Variables

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {};

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [];

  public static readonly ELEMENT_NAME = 'ch5-legacy-media-player-my-music';

  public primaryCssClass = 'ch5-legacy-media-player-my-music';

  private _ch5Properties: Ch5Properties;
  private _myMusicContainer: HTMLElement = {} as HTMLElement;
  private _myMusicHeaderSection: HTMLElement = {} as HTMLElement;
  private _myMusicHeaderBackButton: HTMLElement = {} as HTMLElement;
  private _myMusicHeaderTitle: HTMLElement = {} as HTMLElement;
  private _myMusicHeaderTitleText: HTMLElement = {} as HTMLElement;
  private _myMusicheaderSubtitle: HTMLElement = {} as HTMLElement;
  private _myMusicContentSection: HTMLElement = {} as HTMLElement;
  private _myMusicFooterSection: HTMLElement = {} as HTMLElement;
  private _myMusicContentItem: HTMLElement = {} as HTMLElement;
  private _myMusicContentItemTitle: HTMLElement = {} as HTMLElement;
  private _myMusicContentItemSubtitle: HTMLElement = {} as HTMLElement;
  private _myMusicHeaderNowPlayingButton: HTMLElement = {} as HTMLElement;
  private myMusicData: any;
  private musicPlayerLibInstance: MusicPlayerLib;

  private maxItemsToDisplay = 20;
  private loadItemsCount = this.maxItemsToDisplay;
  private startingIndex = 0;

  private myMusicDemoData = {
    MaxReqItems: 100,
    Level: 5,
    ItemCnt: 489,
    Title: "HEADER TEXT",
    Subtitle: "SUBTITLE",
    IsMenuAvailable: true,
    ListItemIcons: true,
    ListSpecificFunctions: [
      "Create",
      "Find",
      "QuickList",
      "Advanced",
      "BackToTop",
      "Favorites"
    ],
    Sorted: "none",
    MenuData: [
  {
    "L1": "Text Line 0",
    "L2": "Sub Line 0"
  },
  {
    "L1": "Text Line 1",
    "L2": "Sub Line 1"
  },
  {
    "L1": "Text Line 2",
    "L2": "Sub Line 2"
  },
  {
    "L1": "Text Line 3",
    "L2": "Sub Line 3"
  },
  {
    "L1": "Text Line 4",
    "L2": "Sub Line 4"
  },
  {
    "L1": "Text Line 5",
    "L2": "Sub Line 5"
  },
  {
    "L1": "Text Line 6",
    "L2": "Sub Line 6"
  },
  {
    "L1": "Text Line 7",
    "L2": "Sub Line 7"
  },
  {
    "L1": "Text Line 8",
    "L2": "Sub Line 8"
  },
  {
    "L1": "Text Line 9",
    "L2": "Sub Line 9"
  },
  {
    "L1": "Text Line 10",
    "L2": "Sub Line 10"
  },
  {
    "L1": "Text Line 11",
    "L2": "Sub Line 11"
  },
  {
    "L1": "Text Line 12",
    "L2": "Sub Line 12"
  },
  {
    "L1": "Text Line 13",
    "L2": "Sub Line 13"
  },
  {
    "L1": "Text Line 14",
    "L2": "Sub Line 14"
  },
  {
    "L1": "Text Line 15",
    "L2": "Sub Line 15"
  },
  {
    "L1": "Text Line 16",
    "L2": "Sub Line 16"
  },
  {
    "L1": "Text Line 17",
    "L2": "Sub Line 17"
  },
  {
    "L1": "Text Line 18",
    "L2": "Sub Line 18"
  },
  {
    "L1": "Text Line 19",
    "L2": "Sub Line 19"
  },
  {
    "L1": "Text Line 20",
    "L2": "Sub Line 20"
  },
  {
    "L1": "Text Line 21",
    "L2": "Sub Line 21"
  },
  {
    "L1": "Text Line 22",
    "L2": "Sub Line 22"
  },
  {
    "L1": "Text Line 23",
    "L2": "Sub Line 23"
  },
  {
    "L1": "Text Line 24",
    "L2": "Sub Line 24"
  },
  {
    "L1": "Text Line 25",
    "L2": "Sub Line 25"
  },
  {
    "L1": "Text Line 26",
    "L2": "Sub Line 26"
  },
  {
    "L1": "Text Line 27",
    "L2": "Sub Line 27"
  },
  {
    "L1": "Text Line 28",
    "L2": "Sub Line 28"
  },
  {
    "L1": "Text Line 29",
    "L2": "Sub Line 29"
  },
  {
    "L1": "Text Line 30",
    "L2": "Sub Line 30"
  },
  {
    "L1": "Text Line 31",
    "L2": "Sub Line 31"
  },
  {
    "L1": "Text Line 32",
    "L2": "Sub Line 32"
  },
  {
    "L1": "Text Line 33",
    "L2": "Sub Line 33"
  },
  {
    "L1": "Text Line 34",
    "L2": "Sub Line 34"
  },
  {
    "L1": "Text Line 35",
    "L2": "Sub Line 35"
  },
  {
    "L1": "Text Line 36",
    "L2": "Sub Line 36"
  },
  {
    "L1": "Text Line 37",
    "L2": "Sub Line 37"
  },
  {
    "L1": "Text Line 38",
    "L2": "Sub Line 38"
  },
  {
    "L1": "Text Line 39",
    "L2": "Sub Line 39"
  },
  {
    "L1": "Text Line 40",
    "L2": "Sub Line 40"
  },
  {
    "L1": "Text Line 41",
    "L2": "Sub Line 41"
  },
  {
    "L1": "Text Line 42",
    "L2": "Sub Line 42"
  },
  {
    "L1": "Text Line 43",
    "L2": "Sub Line 43"
  },
  {
    "L1": "Text Line 44",
    "L2": "Sub Line 44"
  },
  {
    "L1": "Text Line 45",
    "L2": "Sub Line 45"
  },
  {
    "L1": "Text Line 46",
    "L2": "Sub Line 46"
  },
  {
    "L1": "Text Line 47",
    "L2": "Sub Line 47"
  },
  {
    "L1": "Text Line 48",
    "L2": "Sub Line 48"
  },
  {
    "L1": "Text Line 49",
    "L2": "Sub Line 49"
  },
  {
    "L1": "Text Line 50",
    "L2": "Sub Line 50"
  },
  {
    "L1": "Text Line 51",
    "L2": "Sub Line 51"
  },
  {
    "L1": "Text Line 52",
    "L2": "Sub Line 52"
  },
  {
    "L1": "Text Line 53",
    "L2": "Sub Line 53"
  },
  {
    "L1": "Text Line 54",
    "L2": "Sub Line 54"
  },
  {
    "L1": "Text Line 55",
    "L2": "Sub Line 55"
  },
  {
    "L1": "Text Line 56",
    "L2": "Sub Line 56"
  },
  {
    "L1": "Text Line 57",
    "L2": "Sub Line 57"
  },
  {
    "L1": "Text Line 58",
    "L2": "Sub Line 58"
  },
  {
    "L1": "Text Line 59",
    "L2": "Sub Line 59"
  },
  {
    "L1": "Text Line 60",
    "L2": "Sub Line 60"
  },
  {
    "L1": "Text Line 61",
    "L2": "Sub Line 61"
  },
  {
    "L1": "Text Line 62",
    "L2": "Sub Line 62"
  },
  {
    "L1": "Text Line 63",
    "L2": "Sub Line 63"
  },
  {
    "L1": "Text Line 64",
    "L2": "Sub Line 64"
  },
  {
    "L1": "Text Line 65",
    "L2": "Sub Line 65"
  },
  {
    "L1": "Text Line 66",
    "L2": "Sub Line 66"
  },
  {
    "L1": "Text Line 67",
    "L2": "Sub Line 67"
  },
  {
    "L1": "Text Line 68",
    "L2": "Sub Line 68"
  },
  {
    "L1": "Text Line 69",
    "L2": "Sub Line 69"
  },
  {
    "L1": "Text Line 70",
    "L2": "Sub Line 70"
  },
  {
    "L1": "Text Line 71",
    "L2": "Sub Line 71"
  },
  {
    "L1": "Text Line 72",
    "L2": "Sub Line 72"
  },
  {
    "L1": "Text Line 73",
    "L2": "Sub Line 73"
  },
  {
    "L1": "Text Line 74",
    "L2": "Sub Line 74"
  },
  {
    "L1": "Text Line 75",
    "L2": "Sub Line 75"
  },
  {
    "L1": "Text Line 76",
    "L2": "Sub Line 76"
  },
  {
    "L1": "Text Line 77",
    "L2": "Sub Line 77"
  },
  {
    "L1": "Text Line 78",
    "L2": "Sub Line 78"
  },
  {
    "L1": "Text Line 79",
    "L2": "Sub Line 79"
  },
  {
    "L1": "Text Line 80",
    "L2": "Sub Line 80"
  },
  {
    "L1": "Text Line 81",
    "L2": "Sub Line 81"
  },
  {
    "L1": "Text Line 82",
    "L2": "Sub Line 82"
  },
  {
    "L1": "Text Line 83",
    "L2": "Sub Line 83"
  },
  {
    "L1": "Text Line 84",
    "L2": "Sub Line 84"
  },
  {
    "L1": "Text Line 85",
    "L2": "Sub Line 85"
  },
  {
    "L1": "Text Line 86",
    "L2": "Sub Line 86"
  },
  {
    "L1": "Text Line 87",
    "L2": "Sub Line 87"
  },
  {
    "L1": "Text Line 88",
    "L2": "Sub Line 88"
  },
  {
    "L1": "Text Line 89",
    "L2": "Sub Line 89"
  },
  {
    "L1": "Text Line 90",
    "L2": "Sub Line 90"
  },
  {
    "L1": "Text Line 91",
    "L2": "Sub Line 91"
  },
  {
    "L1": "Text Line 92",
    "L2": "Sub Line 92"
  },
  {
    "L1": "Text Line 93",
    "L2": "Sub Line 93"
  },
  {
    "L1": "Text Line 94",
    "L2": "Sub Line 94"
  },
  {
    "L1": "Text Line 95",
    "L2": "Sub Line 95"
  },
  {
    "L1": "Text Line 96",
    "L2": "Sub Line 96"
  },
  {
    "L1": "Text Line 97",
    "L2": "Sub Line 97"
  },
  {
    "L1": "Text Line 98",
    "L2": "Sub Line 98"
  },
  {
    "L1": "Text Line 99",
    "L2": "Sub Line 99"
  },
  {
    "L1": "Text Line 100",
    "L2": "Sub Line 100"
  },
  {
    "L1": "Text Line 101",
    "L2": "Sub Line 101"
  },
  {
    "L1": "Text Line 102",
    "L2": "Sub Line 102"
  },
  {
    "L1": "Text Line 103",
    "L2": "Sub Line 103"
  },
  {
    "L1": "Text Line 104",
    "L2": "Sub Line 104"
  },
  {
    "L1": "Text Line 105",
    "L2": "Sub Line 105"
  },
  {
    "L1": "Text Line 106",
    "L2": "Sub Line 106"
  },
  {
    "L1": "Text Line 107",
    "L2": "Sub Line 107"
  },
  {
    "L1": "Text Line 108",
    "L2": "Sub Line 108"
  },
  {
    "L1": "Text Line 109",
    "L2": "Sub Line 109"
  },
  {
    "L1": "Text Line 110",
    "L2": "Sub Line 110"
  },
  {
    "L1": "Text Line 111",
    "L2": "Sub Line 111"
  },
  {
    "L1": "Text Line 112",
    "L2": "Sub Line 112"
  },
  {
    "L1": "Text Line 113",
    "L2": "Sub Line 113"
  },
  {
    "L1": "Text Line 114",
    "L2": "Sub Line 114"
  },
  {
    "L1": "Text Line 115",
    "L2": "Sub Line 115"
  },
  {
    "L1": "Text Line 116",
    "L2": "Sub Line 116"
  },
  {
    "L1": "Text Line 117",
    "L2": "Sub Line 117"
  },
  {
    "L1": "Text Line 118",
    "L2": "Sub Line 118"
  },
  {
    "L1": "Text Line 119",
    "L2": "Sub Line 119"
  },
  {
    "L1": "Text Line 120",
    "L2": "Sub Line 120"
  },
  {
    "L1": "Text Line 121",
    "L2": "Sub Line 121"
  },
  {
    "L1": "Text Line 122",
    "L2": "Sub Line 122"
  },
  {
    "L1": "Text Line 123",
    "L2": "Sub Line 123"
  },
  {
    "L1": "Text Line 124",
    "L2": "Sub Line 124"
  },
  {
    "L1": "Text Line 125",
    "L2": "Sub Line 125"
  },
  {
    "L1": "Text Line 126",
    "L2": "Sub Line 126"
  },
  {
    "L1": "Text Line 127",
    "L2": "Sub Line 127"
  },
  {
    "L1": "Text Line 128",
    "L2": "Sub Line 128"
  },
  {
    "L1": "Text Line 129",
    "L2": "Sub Line 129"
  },
  {
    "L1": "Text Line 130",
    "L2": "Sub Line 130"
  },
  {
    "L1": "Text Line 131",
    "L2": "Sub Line 131"
  },
  {
    "L1": "Text Line 132",
    "L2": "Sub Line 132"
  },
  {
    "L1": "Text Line 133",
    "L2": "Sub Line 133"
  },
  {
    "L1": "Text Line 134",
    "L2": "Sub Line 134"
  },
  {
    "L1": "Text Line 135",
    "L2": "Sub Line 135"
  },
  {
    "L1": "Text Line 136",
    "L2": "Sub Line 136"
  },
  {
    "L1": "Text Line 137",
    "L2": "Sub Line 137"
  },
  {
    "L1": "Text Line 138",
    "L2": "Sub Line 138"
  },
  {
    "L1": "Text Line 139",
    "L2": "Sub Line 139"
  },
  {
    "L1": "Text Line 140",
    "L2": "Sub Line 140"
  },
  {
    "L1": "Text Line 141",
    "L2": "Sub Line 141"
  },
  {
    "L1": "Text Line 142",
    "L2": "Sub Line 142"
  },
  {
    "L1": "Text Line 143",
    "L2": "Sub Line 143"
  },
  {
    "L1": "Text Line 144",
    "L2": "Sub Line 144"
  },
  {
    "L1": "Text Line 145",
    "L2": "Sub Line 145"
  },
  {
    "L1": "Text Line 146",
    "L2": "Sub Line 146"
  },
  {
    "L1": "Text Line 147",
    "L2": "Sub Line 147"
  },
  {
    "L1": "Text Line 148",
    "L2": "Sub Line 148"
  },
  {
    "L1": "Text Line 149",
    "L2": "Sub Line 149"
  },
  {
    "L1": "Text Line 150",
    "L2": "Sub Line 150"
  },
  {
    "L1": "Text Line 151",
    "L2": "Sub Line 151"
  },
  {
    "L1": "Text Line 152",
    "L2": "Sub Line 152"
  },
  {
    "L1": "Text Line 153",
    "L2": "Sub Line 153"
  },
  {
    "L1": "Text Line 154",
    "L2": "Sub Line 154"
  },
  {
    "L1": "Text Line 155",
    "L2": "Sub Line 155"
  },
  {
    "L1": "Text Line 156",
    "L2": "Sub Line 156"
  },
  {
    "L1": "Text Line 157",
    "L2": "Sub Line 157"
  },
  {
    "L1": "Text Line 158",
    "L2": "Sub Line 158"
  },
  {
    "L1": "Text Line 159",
    "L2": "Sub Line 159"
  },
  {
    "L1": "Text Line 160",
    "L2": "Sub Line 160"
  },
  {
    "L1": "Text Line 161",
    "L2": "Sub Line 161"
  },
  {
    "L1": "Text Line 162",
    "L2": "Sub Line 162"
  },
  {
    "L1": "Text Line 163",
    "L2": "Sub Line 163"
  },
  {
    "L1": "Text Line 164",
    "L2": "Sub Line 164"
  },
  {
    "L1": "Text Line 165",
    "L2": "Sub Line 165"
  },
  {
    "L1": "Text Line 166",
    "L2": "Sub Line 166"
  },
  {
    "L1": "Text Line 167",
    "L2": "Sub Line 167"
  },
  {
    "L1": "Text Line 168",
    "L2": "Sub Line 168"
  },
  {
    "L1": "Text Line 169",
    "L2": "Sub Line 169"
  },
  {
    "L1": "Text Line 170",
    "L2": "Sub Line 170"
  },
  {
    "L1": "Text Line 171",
    "L2": "Sub Line 171"
  },
  {
    "L1": "Text Line 172",
    "L2": "Sub Line 172"
  },
  {
    "L1": "Text Line 173",
    "L2": "Sub Line 173"
  },
  {
    "L1": "Text Line 174",
    "L2": "Sub Line 174"
  },
  {
    "L1": "Text Line 175",
    "L2": "Sub Line 175"
  },
  {
    "L1": "Text Line 176",
    "L2": "Sub Line 176"
  },
  {
    "L1": "Text Line 177",
    "L2": "Sub Line 177"
  },
  {
    "L1": "Text Line 178",
    "L2": "Sub Line 178"
  },
  {
    "L1": "Text Line 179",
    "L2": "Sub Line 179"
  },
  {
    "L1": "Text Line 180",
    "L2": "Sub Line 180"
  },
  {
    "L1": "Text Line 181",
    "L2": "Sub Line 181"
  },
  {
    "L1": "Text Line 182",
    "L2": "Sub Line 182"
  },
  {
    "L1": "Text Line 183",
    "L2": "Sub Line 183"
  },
  {
    "L1": "Text Line 184",
    "L2": "Sub Line 184"
  },
  {
    "L1": "Text Line 185",
    "L2": "Sub Line 185"
  },
  {
    "L1": "Text Line 186",
    "L2": "Sub Line 186"
  },
  {
    "L1": "Text Line 187",
    "L2": "Sub Line 187"
  },
  {
    "L1": "Text Line 188",
    "L2": "Sub Line 188"
  },
  {
    "L1": "Text Line 189",
    "L2": "Sub Line 189"
  },
  {
    "L1": "Text Line 190",
    "L2": "Sub Line 190"
  },
  {
    "L1": "Text Line 191",
    "L2": "Sub Line 191"
  },
  {
    "L1": "Text Line 192",
    "L2": "Sub Line 192"
  },
  {
    "L1": "Text Line 193",
    "L2": "Sub Line 193"
  },
  {
    "L1": "Text Line 194",
    "L2": "Sub Line 194"
  },
  {
    "L1": "Text Line 195",
    "L2": "Sub Line 195"
  },
  {
    "L1": "Text Line 196",
    "L2": "Sub Line 196"
  },
  {
    "L1": "Text Line 197",
    "L2": "Sub Line 197"
  },
  {
    "L1": "Text Line 198",
    "L2": "Sub Line 198"
  },
  {
    "L1": "Text Line 199",
    "L2": "Sub Line 199"
  },
  {
    "L1": "Text Line 200",
    "L2": "Sub Line 200"
  },
  {
    "L1": "Text Line 201",
    "L2": "Sub Line 201"
  },
  {
    "L1": "Text Line 202",
    "L2": "Sub Line 202"
  },
  {
    "L1": "Text Line 203",
    "L2": "Sub Line 203"
  },
  {
    "L1": "Text Line 204",
    "L2": "Sub Line 204"
  },
  {
    "L1": "Text Line 205",
    "L2": "Sub Line 205"
  },
  {
    "L1": "Text Line 206",
    "L2": "Sub Line 206"
  },
  {
    "L1": "Text Line 207",
    "L2": "Sub Line 207"
  },
  {
    "L1": "Text Line 208",
    "L2": "Sub Line 208"
  },
  {
    "L1": "Text Line 209",
    "L2": "Sub Line 209"
  },
  {
    "L1": "Text Line 210",
    "L2": "Sub Line 210"
  },
  {
    "L1": "Text Line 211",
    "L2": "Sub Line 211"
  },
  {
    "L1": "Text Line 212",
    "L2": "Sub Line 212"
  },
  {
    "L1": "Text Line 213",
    "L2": "Sub Line 213"
  },
  {
    "L1": "Text Line 214",
    "L2": "Sub Line 214"
  },
  {
    "L1": "Text Line 215",
    "L2": "Sub Line 215"
  },
  {
    "L1": "Text Line 216",
    "L2": "Sub Line 216"
  },
  {
    "L1": "Text Line 217",
    "L2": "Sub Line 217"
  },
  {
    "L1": "Text Line 218",
    "L2": "Sub Line 218"
  },
  {
    "L1": "Text Line 219",
    "L2": "Sub Line 219"
  },
  {
    "L1": "Text Line 220",
    "L2": "Sub Line 220"
  },
  {
    "L1": "Text Line 221",
    "L2": "Sub Line 221"
  },
  {
    "L1": "Text Line 222",
    "L2": "Sub Line 222"
  },
  {
    "L1": "Text Line 223",
    "L2": "Sub Line 223"
  },
  {
    "L1": "Text Line 224",
    "L2": "Sub Line 224"
  },
  {
    "L1": "Text Line 225",
    "L2": "Sub Line 225"
  },
  {
    "L1": "Text Line 226",
    "L2": "Sub Line 226"
  },
  {
    "L1": "Text Line 227",
    "L2": "Sub Line 227"
  },
  {
    "L1": "Text Line 228",
    "L2": "Sub Line 228"
  },
  {
    "L1": "Text Line 229",
    "L2": "Sub Line 229"
  },
  {
    "L1": "Text Line 230",
    "L2": "Sub Line 230"
  },
  {
    "L1": "Text Line 231",
    "L2": "Sub Line 231"
  },
  {
    "L1": "Text Line 232",
    "L2": "Sub Line 232"
  },
  {
    "L1": "Text Line 233",
    "L2": "Sub Line 233"
  },
  {
    "L1": "Text Line 234",
    "L2": "Sub Line 234"
  },
  {
    "L1": "Text Line 235",
    "L2": "Sub Line 235"
  },
  {
    "L1": "Text Line 236",
    "L2": "Sub Line 236"
  },
  {
    "L1": "Text Line 237",
    "L2": "Sub Line 237"
  },
  {
    "L1": "Text Line 238",
    "L2": "Sub Line 238"
  },
  {
    "L1": "Text Line 239",
    "L2": "Sub Line 239"
  },
  {
    "L1": "Text Line 240",
    "L2": "Sub Line 240"
  },
  {
    "L1": "Text Line 241",
    "L2": "Sub Line 241"
  },
  {
    "L1": "Text Line 242",
    "L2": "Sub Line 242"
  },
  {
    "L1": "Text Line 243",
    "L2": "Sub Line 243"
  },
  {
    "L1": "Text Line 244",
    "L2": "Sub Line 244"
  },
  {
    "L1": "Text Line 245",
    "L2": "Sub Line 245"
  },
  {
    "L1": "Text Line 246",
    "L2": "Sub Line 246"
  },
  {
    "L1": "Text Line 247",
    "L2": "Sub Line 247"
  },
  {
    "L1": "Text Line 248",
    "L2": "Sub Line 248"
  },
  {
    "L1": "Text Line 249",
    "L2": "Sub Line 249"
  }
    ]
  }

  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5LegacyMediaPlayerMyMusic.ELEMENT_NAME, Ch5LegacyMediaPlayerMyMusic.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5LegacyMediaPlayerMyMusic.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5LegacyMediaPlayerMyMusic.ELEMENT_NAME, Ch5LegacyMediaPlayerMyMusic);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor(musicPlayerLib: MusicPlayerLib, ref: any) {
    super();
    this.musicPlayerLibInstance = musicPlayerLib;
    this.logger.start('constructor()', Ch5LegacyMediaPlayerMyMusic.ELEMENT_NAME);
    this._ch5Properties = new Ch5Properties(this, Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES);
    this._myMusicContainer = document.createElement('div');
    this.createDefaultMyMusic();
    this.updateCssClass();
    this.startingIndex = 0;
    subscribeState('o', 'myMusicData', ((data: any) => {
      setTimeout(() => {
        if (ref.demoMode) {
          this.createMyMusic();
          this.myMusicData = this.myMusicDemoData;
          if (this.myMusicData && Object.keys(this.myMusicData).length > 0) this.apiChanges();
        } else if (data && Object.keys(data).length > 0) {
          this.createMyMusic();
          this.myMusicData = data
          console.log('My Music Data', this.myMusicData);
          if (this.myMusicData && Object.keys(this.myMusicData).length > 0 && this.myMusicData['MenuData'] && Object.keys(this.myMusicData['MenuData']).length > 0) this.apiChanges();
        } else {
          this.createDefaultMyMusic();
        }
        this.updateCssClass();
      }, 100);
    }));
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Log.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-legacy-media-player-my-music attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
      if (attributeChangedProperty) {
        const thisRef: any = this;
        const key = attributeChangedProperty.name;
        thisRef[key] = newValue;
      } else {
        super.attributeChangedCallback(attr, oldValue, newValue);
      }
    }
    this.logger.stop();
  }

  /**
   * Called when the Ch5LegacyMediaPlayerMyMusic component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5LegacyMediaPlayerMyMusic.ELEMENT_NAME);
    this.initAttributes();
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.unsubscribeFromSignals();
    this.logger.stop();
  }

  public createInternalHtml() {
    return this._myMusicContainer;
  }

  //default my music
  protected createDefaultMyMusic() {
    if (this._myMusicContainer) {
      this._myMusicContainer.className = "";
      this._myMusicContainer.innerHTML = "";
    }
    //this._myMusicContainer = document.createElement('div');
    this._myMusicContainer.classList.add("ch5-legacy-media-player-my-music-default");
    const defaultHeaderContainer = document.createElement('div');
    defaultHeaderContainer.classList.add('default-header-container');
    const defaultBackIcon = new Ch5LegacyMediaPlayerIconButton();
    defaultBackIcon.setAttribute('iconClass', "mp-icon mp-chevron-left");
    const headerTitleNone = document.createElement('div');
    headerTitleNone.classList.add('header-title-none');
    headerTitleNone.textContent = '— —';
    const defaultMusicIcon = new Ch5LegacyMediaPlayerIconButton();
    defaultMusicIcon.setAttribute('iconClass', "mp-logo mp-animated-bar");
    defaultHeaderContainer.append(defaultBackIcon, headerTitleNone, defaultMusicIcon);
    const defaultItemsContainer = document.createElement("div");
    defaultItemsContainer.classList.add('default-item-container');
    const defaultItem = document.createElement('div');
    defaultItem.classList.add('default-item');
    defaultItem.textContent = 'No Content';
    defaultItemsContainer.append(defaultItem);
    const defaultFooterContainer = document.createElement('div');
    defaultFooterContainer.classList.add('default-footer-container');
    const defaultCreateIcon = new Ch5LegacyMediaPlayerIconButton();
    defaultCreateIcon.setAttribute('iconClass', "mp-icon mp-plus-circle");
    const defaultFindIcon = new Ch5LegacyMediaPlayerIconButton();
    defaultFindIcon.setAttribute('iconClass', "mp-icon mp-search-lg");
    defaultFooterContainer.append(defaultCreateIcon, defaultFindIcon);
    this._myMusicContainer.append(defaultHeaderContainer, defaultItemsContainer, defaultFooterContainer);
  }

  protected createMyMusic() {
    if (this._myMusicContainer) {
      this._myMusicContainer.className = "";
      this._myMusicContainer.innerHTML = "";
    }
    this.logger.start('createInternalHtml()');
    this.clearComponentContent();
    this._myMusicContainer.classList.add("ch5-legacy-media-player-my-music");

    this._myMusicHeaderSection = document.createElement("div");
    this._myMusicHeaderSection.className = 'my-music-header';
    // this.myMusicHeader(true, "HEADER TEXT", "SUBTITLE");


    this._myMusicContentSection = document.createElement("div");
    this._myMusicContentSection.className = 'my-music-content';
    // for (let i = 1; i <= 6; i++) {
    //   this.createLine(`Text Line ${i}`, `Sub Line ${i}`, `item ${i}`, i + 1);
    // }

    let lastScrollTop = 0;
    this._myMusicContentSection.onscroll = () => {
      const scrollTop = window.pageYOffset || this._myMusicContentSection.scrollTop;;
      const scrollHeight: number = this._myMusicContentSection.scrollHeight;
      const clientHeight = this._myMusicContentSection.clientHeight || window.innerHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (scrollTop > lastScrollTop && this.myMusicData['MenuData'].length > this.loadItemsCount) {
        if (distanceFromBottom <= 50) {
          console.log("50px away from bottom")
          // delete 1st element and push element in the end
          const list = this._myMusicContentSection;
          const childrenArray = Array.from(list.children);
          const firstChild = childrenArray[0];
          if (firstChild) {
            list.removeChild(firstChild);
          }

          this.createLine(this.loadItemsCount, 'end')
          this.loadItemsCount = this.loadItemsCount + 1;
        }
      } else if (scrollTop < lastScrollTop && this.loadItemsCount > this.maxItemsToDisplay) {
        console.log("Scrolling up");
        if (scrollTop <= 50) {
          console.log("50px away from top");
          // delete 1st element and push element in the end
          const list = this._myMusicContentSection;
          const childrenArray = Array.from(list.children);

          if (childrenArray.length >= this.maxItemsToDisplay) {
            list.removeChild(childrenArray[childrenArray.length - 1]);
          }

          this.loadItemsCount -= 1;
          this.createLine(this.loadItemsCount - this.maxItemsToDisplay, 'start');
        }
      }
      lastScrollTop = Math.max(scrollTop, 0);      
    };

    this._myMusicFooterSection = document.createElement("div");
    this._myMusicFooterSection.className = 'my-music-footer';
    // this.myMusicMenuIconSection(["Create", "Find", "QuickList", "Advanced", "BackToTop", "Favorites"])

    this._myMusicContainer.append(this._myMusicHeaderSection, this._myMusicContentSection, this._myMusicFooterSection);
    this.logger.stop();
  }


  protected createLine(index: number, position='end') {
    console.log("creating line for index", index, this.myMusicData['MenuData'], this.myMusicData['MenuData'].length)
    if(index+1 >= this.myMusicData['MenuData'].length){
      this.musicPlayerLibInstance.getItemData(true);
    }
    this.printedIndex = index;
    
    if(!this.myMusicData['MenuData'] || !this.myMusicData['MenuData'][index]) return;

    const text = this.myMusicData['MenuData'][index]['L1'];
    const subText = this.myMusicData['MenuData'][index]['L2'];
    const itemId = this.myMusicData['MenuData'][index]['Id'];

    this._myMusicContentItem = document.createElement('div');
    this._myMusicContentItem.className = 'my-music-content-item';
    this._myMusicContentItem.id = itemId;
    this._myMusicContentItemTitle = document.createElement('div');
    this._myMusicContentItemTitle.className = 'my-music-content-item-title';
    this._myMusicContentItemTitle.textContent = text;
    this._myMusicContentItemSubtitle = document.createElement('div');
    this._myMusicContentItemSubtitle.className = 'my-music-content-item-subtitle';
    this._myMusicContentItemSubtitle.textContent = subText;
    // this._myMusicContentItemSubtitle.style.visibility = subText ? 'visible' : 'hidden';

    if (this._myMusicHeaderTitleText.innerText === 'Favorites') {
      let holdTimer: number | null = null;
      let isHeld = false;

      this._myMusicContentItem.addEventListener('pointerdown', () => {
        isHeld = false;
        holdTimer = window.setTimeout(() => {
          isHeld = true;
          this.musicPlayerLibInstance.myMusicEvent('PressAndHold', index + 1); // PressAndHold action
        }, 3000); // 3 seconds
      });

      this._myMusicContentItem.addEventListener('pointerup', () => {
        if (holdTimer !== null) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
      });

      this._myMusicContentItem.addEventListener('click', () => { // Click Action
        if (!isHeld) {
          this.musicPlayerLibInstance.myMusicEvent('Select', index + 1);
        }
      });
    } else {
      this._myMusicContentItem.onclick = () => {
        this.musicPlayerLibInstance.myMusicEvent('Select', index + 1);
      }
    }

    this._myMusicContentItem.appendChild(this._myMusicContentItemTitle);
    this._myMusicContentItem.appendChild(this._myMusicContentItemSubtitle);
    // this._myMusicContentSection.appendChild(this._myMusicContentItem);
    
    const list = this._myMusicContentSection;
    if (position === 'start') {
      list.insertBefore(this._myMusicContentItem, list.firstChild);
    } else {
      list.appendChild(this._myMusicContentItem);
    }
    
  }

  protected myMusicHeader(backButton: boolean, myMusicHeaderTitleText: string, myMusicheaderSubtitle: string) {
    if (backButton) {
      this._myMusicHeaderBackButton = new Ch5LegacyMediaPlayerIconButton();
      this._myMusicHeaderBackButton.setAttribute('iconClass', "mp-icon mp-chevron-left");
      this._myMusicHeaderBackButton.classList.add('my-music-header-back-button');
      this._myMusicHeaderBackButton.onclick = () => {
        this.musicPlayerLibInstance.myMusicEvent('Back');
      }
      this._myMusicHeaderSection.prepend(this._myMusicHeaderBackButton);
    }

    this._myMusicHeaderTitle = document.createElement("div");
    this._myMusicHeaderTitle.className = 'my-music-header-title';

    this._myMusicHeaderTitleText = document.createElement("div");
    this._myMusicHeaderTitleText.className = 'my-music-header-title-text';
    this._myMusicHeaderTitleText.innerText = myMusicHeaderTitleText;
    this._myMusicheaderSubtitle = document.createElement("div");
    this._myMusicheaderSubtitle.className = 'my-music-header-subtitle';
    this._myMusicheaderSubtitle.innerText = myMusicheaderSubtitle;
    this._myMusicheaderSubtitle.style.visibility = myMusicheaderSubtitle ? 'visible' : 'hidden';

    this._myMusicHeaderTitle.append(this._myMusicHeaderTitleText, this._myMusicheaderSubtitle);

    this._myMusicHeaderNowPlayingButton = new Ch5LegacyMediaPlayerIconButton();
    this._myMusicHeaderNowPlayingButton.setAttribute('iconClass', "mp-logo mp-animated-bar");
    this._myMusicHeaderNowPlayingButton.classList.add("my-music-header-now-playing-button");
    this._myMusicHeaderNowPlayingButton.onclick = () => {
      this._myMusicContainer.classList.remove("my-music-transition");
    };
    this._myMusicHeaderSection.append(this._myMusicHeaderTitle, this._myMusicHeaderNowPlayingButton);
  }

  protected myMusicMenuIconSection(myMusicMenuIconArray: Array<string>) {
    const actions = [
      { class: 'mp-icon mp-plus-circle', name: 'Create' },
      { class: 'mp-icon mp-search-lg', name: 'Find' },
      { class: 'mp-icon mp-music-note-list', name: 'QuickList' },
      { class: 'mp-icon mp-settings', name: 'Advanced' },
      { class: 'mp-icon mp-music-list-home', name: 'BackToTop' },
      { class: 'mp-icon mp-music-list-favorites', name: 'Favorites' },
      { class: 'mp-icon mp-play-multi-square', name: 'PlayAll' },
    ];
    if (myMusicMenuIconArray?.length) {
      actions.forEach(action => {
        for (let i = 0; i < myMusicMenuIconArray.length; i++) {
          const item = myMusicMenuIconArray[i];
          if (item === action.name) {
            const button = new Ch5LegacyMediaPlayerIconButton();
            button.setAttribute('iconClass', action.class);
            button.id = item;
            button.onclick = () => {
              this.musicPlayerLibInstance.myMusicEvent(item);
            };
            this._myMusicFooterSection.appendChild(button);
          }
        };
      });
    }
  }

  private printedIndex =0;
  private displayVisibleOnlyItems() {
    if(this.myMusicData['ItemCnt'] == this.myMusicData['MenuData'].length) {
      this.loadItemsCount = this.myMusicData['MenuData'].length;
    }
    console.log("displayVisibleOnlyItems");
    console.log("loadItemsCount -------->>>", this.loadItemsCount);
        
    if (this.myMusicData && this.myMusicData.MenuData) {
      for (let index = 0; index < this.loadItemsCount; index++) {
        this.createLine(index);
      }
    }
  }
  
  protected apiChanges() {
    Array.from(this._myMusicHeaderSection.childNodes).forEach((child) => child.remove());
    // Array.from(this._myMusicContentSection.childNodes).forEach((child) => child.remove());
    Array.from(this._myMusicFooterSection.childNodes).forEach((child) => child.remove());

    this.myMusicHeader(this.myMusicData.IsMenuAvailable, this.myMusicData.Title, this.myMusicData.Subtitle);
    this.displayVisibleOnlyItems();
    this.myMusicMenuIconSection(this.myMusicData.ListSpecificFunctions);
  }

  //#endregion

  //#region Protected / Private Methods
  protected initAttributes() {
    super.initAttributes();

    const thisRef: any = this;
    for (let i: number = 0; i < Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }

  protected unsubscribeFromSignals() {
    // super.unsubscribeFromSignals();
    this._ch5Properties.unsubscribe();
  }

  /**
   * Clear the content of component in order to avoid duplication of elements
   */
  private clearComponentContent() {
    const containers = this.getElementsByTagName("div");
    Array.from(containers).forEach((container) => {
      container.remove();
    });
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    // super.updateCssClasses();
    this.logger.stop();
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

  //#endregion
}

Ch5LegacyMediaPlayerMyMusic.registerCustomElement();
Ch5LegacyMediaPlayerMyMusic.registerSignalAttributeTypes();
