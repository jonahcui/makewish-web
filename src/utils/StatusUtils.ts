import {Badge} from "evergreen-ui";
import styles from "../components/GoodCard/GoodCard.module.scss";
import React from "react";
import {GoodInfo} from "../feature/goods/goodsAPI";

export enum GoodStatus {
    NON_GOOD,
    UN_START,
    IN_PROGRESS,
    LOCKED,
    SUCCESS,
    FAILED
}

export function getGoodStatus(goodInfo: GoodInfo) {
    if (!goodInfo) {
         return GoodStatus.NON_GOOD;
    }
    if (goodInfo.winner !== null && goodInfo.winner !== undefined && goodInfo.winner.indexOf("0x0000000000000000")  < 0) {
        return GoodStatus.SUCCESS;
    }
    if (new Date().getTime()/ 1000 > parseInt(String(goodInfo.lockedTime)) ) {
        return GoodStatus.LOCKED;
    }
    if (new Date().getTime()/ 1000 < parseInt(String(goodInfo.publishTime)) + 60 ) {
        return GoodStatus.UN_START;
    }
    return GoodStatus.IN_PROGRESS;
}
