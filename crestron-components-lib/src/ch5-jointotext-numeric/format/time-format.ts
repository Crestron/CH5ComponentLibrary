import { NumericFormat } from "./numeric-format";

export type TimeFormatOptions = {}

export class TimeFormat extends NumericFormat {
    
    public format(value: number, options: TimeFormatOptions) {
        if (isNaN(value) || value < 0){
            return "00:00";
       }
        let formattedText = "";
        const hours = Math.floor(Math.floor(value / 60) / 60) % 24;
        const minutes = Math.floor(value / 60) % 60;
        const seconds = Math.round(value % 60);

        // decide whether we should be using any hours field
        const hoursText =
        hours === 0 ? "" : (hours < 10 ? "0" + hours : hours) + ":";
        formattedText +=
        hoursText +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);

        return formattedText;
    }

}