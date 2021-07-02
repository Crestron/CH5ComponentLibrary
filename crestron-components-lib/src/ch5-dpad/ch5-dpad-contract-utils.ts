import {
    IBottomBtnContract, ICenterBtnContract, ICh5DpadContract, ILeftBtnContract, IRightBtnContract, ITopBtnContract
} from "./interfaces/i-ch5-dpad-utils";

export class CH5DpadContractUtils {

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
            CenterLabel: "CenterLabel"
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
            TopShow: "TopShow"
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
            RightShow: "RightShow"
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
            BottomShow: "BottomShow"
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
            LeftShow: "LeftShow"
        };
        return leftBtn;
    }
}