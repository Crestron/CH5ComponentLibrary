import { CH5DpadUtils } from "./ch5-dpad-utils";
import {
    IBottomBtnContract, ICenterBtnContract, ICh5DpadContract, ILeftBtnContract, IRightBtnContract, ITopBtnContract
} from "./interfaces/i-ch5-dpad-utils";
import { signalStructure } from "./interfaces/t-ch5-dpad";

export class CH5DpadContractUtils {

    // the join number is applied to the top button, join+1 applies to bottom,
    // join+2 applies to left, join+3 applies to right, join+4 to center
    public static readonly sendEventOnClickSigCountToAdd = {
        top: 0,
        bottom: 1,
        left: 2,
        right: 3,
        center: 4
    };

    /**
     * Function to return the entire contract structure as a JSON for reference and consumption
     * @returns entire contract structure
     */
    public static getStructure(): ICh5DpadContract {
        return {
            centerBtn: this.getCenterBtnContract(),
            topBtn: this.getTopBtnContract(),
            rightBtn: this.getRightBtnContract(),
            bottomBtn: this.getBottomBtnContract(),
            leftBtn: this.getLeftBtnContract()
        } as ICh5DpadContract;
    }

    /**
     * Function to return center button contract structure
     * @returns center button contract structure as values
     */
    public static getCenterBtnContract(): ICenterBtnContract {
        const centerBtn: ICenterBtnContract = {
            CenterClicked: "CenterClicked",
            CenterEnable: "CenterEnable",
            CenterShow: "CenterShow",
            CenterLabel: "CenterLabel",
            CenterIconClass: "iconClassCenterButton",
            CenterIconUrl: "iconClassCenterUrl"
        };
        return centerBtn;
    }

    /**
     * Function to return top button contract structure
     * @returns center button contract structure as values
     */
    public static getTopBtnContract(): ITopBtnContract {
        const topBtn: ITopBtnContract = {
            TopClicked: "TopClicked",
            TopEnable: "TopEnable",
            TopShow: "TopShow",
            TopIconClass: "iconClassTopButton",
            TopIconUrl: "iconClassTopUrl"
        };
        return topBtn;
    }

    /**
     * Function to return right button contract structure
     * @returns center button contract structure as values
     */
    public static getRightBtnContract(): IRightBtnContract {
        const rightBtn: IRightBtnContract = {
            RightClicked: "RightClicked",
            RightEnable: "RightEnable",
            RightShow: "RightShow",
            RightIconClass: "iconClassRightButton",
            RightIconUrl: "iconClassRightUrl"
        };
        return rightBtn;
    }

    /**
     * Function to return bottom button contract structure
     * @returns center button contract structure as values
     */
    public static getBottomBtnContract(): IBottomBtnContract {
        const bottomBtn: IBottomBtnContract = {
            BottomClicked: "BottomClicked",
            BottomEnable: "BottomEnable",
            BottomShow: "BottomShow",
            BottomIconClass: "iconClassBottomButton",
            BottomIconUrl: "iconClassBottomUrl"
        };
        return bottomBtn;
    }

    /**
     * Function to return bottom button contract structure
     * @returns center button contract structure as values
     */
    public static getLeftBtnContract(): ILeftBtnContract {
        const leftBtn: ILeftBtnContract = {
            LeftClicked: "LeftClicked",
            LeftEnable: "LeftEnable",
            LeftShow: "LeftShow",
            LeftIconClass: "iconClassLeftButton",
            LeftIconUrl: "iconClassLeftUrl"
        };
        return leftBtn;
    }

    /**
     * Function to update click handler based on contract
     * @param signalName contract signal name for click
     */
    public static checkAndUpdateClickHandler(thisRef: any, signalName: string = '') {
        thisRef.parentContractBasedState.click.signalName = signalName;
        CH5DpadUtils.subscribeStateForContract(thisRef.parentContractBasedState.click,
            () => {
                const res = thisRef.parentContractBasedState.click.response;
                console.log(`Click response is :${res}: for ${thisRef.crId} is rendered void.`);
            }
        );
    }

    /**
     * Function to update Show based on contract
     * @param signalName contract signal name for show
     */
    public static checkAndUpdateShowHandler(thisRef: any, signalName: string = '') {
        (thisRef.parentContractBasedState.show as signalStructure).signalName = signalName;
        CH5DpadUtils.subscribeStateForContract(thisRef.parentContractBasedState.show,
            () => {
                thisRef.show = (thisRef.parentContractBasedState.show.response.toString() === 'true');
            }
        );
    }

    /**
     * Function to update Enable handler based on contract
     * @param signalName contract signal name for Enable
     */
    public static checkAndUpdateEnableHandler(thisRef: any, signalName: string = '') {
        thisRef.parentContractBasedState.enable.signalName = signalName;
        CH5DpadUtils.subscribeStateForContract(thisRef.parentContractBasedState.enable,
            () => {
                thisRef.enable = (thisRef.parentContractBasedState.enable.response.toString() === 'true');
            }
        );
    }

    /**
     * Function to update iconClass based on contract
     * @param signalName contract signal name for iconClass
     */
    public static checkAndUpdateIconClassHandler(thisRef: any, signalName: string = '') {
        thisRef.parentContractBasedState.iconClass.signalName = signalName;
        CH5DpadUtils.subscribeStateForContract(thisRef.parentContractBasedState.iconClass,
            () => {
                const ele = thisRef._icon as HTMLElement;
                ele.classList.add(thisRef.parentContractBasedState.iconClass.response);
                ele.classList.add('dpad-btn-icon');
            }
        );
    }

    /**
     * Function to update iconUrl handler based on contract
     * @param signalName contract signal name for iconUrl
     */
    public static checkAndUpdateIconUrlHandler(thisRef: any, signalName: string = '') {
        thisRef.parentContractBasedState.iconUrl.signalName = signalName;
        CH5DpadUtils.subscribeStateForContract(thisRef.parentContractBasedState.iconUrl,
            () => {
                const ele = thisRef._icon as HTMLElement;
                ele.classList.add(thisRef.parentContractBasedState.iconClass.response);
                ele.classList.add(thisRef.CSS_CLASS_LIST.imageClassName);
                ele.classList.add('dpad-btn-icon');
            }
        );
    }

    /**
     * Function to update label based on contract
     * @param signalName contract signal name for label
     */
    public static checkAndUpdateLabelHandler(thisRef: any, labelClassName: string, signalName: string = '') {
        thisRef.parentContractBasedState.label.signalName = signalName;
        CH5DpadUtils.subscribeStateForContract(thisRef.parentContractBasedState.label,
            () => {
                const ele = thisRef._icon as HTMLElement;
                ele.innerHTML = thisRef.parentContractBasedState.label.response;
                ele.classList.add(labelClassName);
                // dpad-btn-label label-class
            }
        );
    }
}