import moment from "moment";
import BigNumber from "bignumber.js";

export const formatTime = (time?: number) => {
    if (!time) {
        return ''
    }

    return moment(time * 1000).format("YYYY-MM-DD HH:mm:ss")
}


export const formatNumber = (n?: number) => {
    if (!n) {
        return ''
    }
    return new BigNumber(n + '').div(new BigNumber(10 ** 18)).toString();
}
