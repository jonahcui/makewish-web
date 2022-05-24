import {getApiContract, getIPFS, getWeb3, readJSONFromIPFS} from "../../utils/Web3Request";

export interface GoodInfo {
    goodId: number
    goodValue: number
    publishTime: number
    lockedTime: number
    maintenanceFee: number
    joinedUsers: number
    ticketCounts: number
    balance: number
    winner: string
    goodHash: string
    goodInfo: string
    goodName: string
    fileHash: string
    paybackFee: number
    winnerBlock: number
    winnerIndex: number
    winnerTime: number
}

export interface UserGoodRecord {
     user: string;
     count: number;
     joined: boolean;
     joinTime: number;
     joinBlockNum: number;
     joinBlockHash: string;
}


export async function getGoodInfo(index: number) {
    const apiContract = await getApiContract();
    if (!apiContract) {
        return null
    }
    const res = await  apiContract.methods.getGoodInfo(index).call();
    if (res.goodId == 0) {
        return null;
    }
    if (res?.goodHash) {
        const goodInfoInIPFS = await readJSONFromIPFS(res?.goodHash)
        return {...goodInfoInIPFS, ...res}
    }

    return {...res}

}

export async function getUserRecord(index: number, num: number) {
    const apiContract = await getApiContract();
    if (!apiContract) {
        return null
    }
    return await  apiContract.methods.getUserRecord(index, num).call();
}

export async function getUserTickets(index: number, account: string) {
    const apiContract = await getApiContract();
    if (!apiContract) {
        return null
    }
    return await  apiContract.methods.getUserTickets(index, account).call();
}
