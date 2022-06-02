import {getApiContract, getReadableTokenContract, getTokenContract} from "../../utils/Web3Request";
import {UserHistory} from "../goods/goodsAPI";
export interface TransferHistory {
     from: string;
     to: string;
     amount: number;
     blockNum: string;
     transferType: number;
     goodIndex: number;
     goodId: number;
     goodHash: string;
}

export async function getUserBalance(account: string) {
    const tokenContract = await getReadableTokenContract();
    if (!tokenContract) {
        return null
    }
    return await tokenContract.methods.balanceOf(account).call();
}

export async function getTotalSupply() {
    const tokenContract = await getReadableTokenContract();
    if (!tokenContract) {
        return null
    }
    return await tokenContract.methods.totalSupply().call();
}

export async function getUserTransferHistories(address: string): Promise<Array<TransferHistory>> {
    const apiContract = await getApiContract();
    if (!apiContract) {
        return []
    }
    return await  apiContract.methods.getUserTransferHistory(address).call();
}
