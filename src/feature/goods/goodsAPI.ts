import {getApiContract, getIPFS, getWeb3, readJSONFromIPFS} from "../../utils/Web3Request";

export interface GoodInfo {
    goodId: number
    goodValue: number
    publishTime: number
    lockedTime: string
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

export interface UserHistory {
    goodId: number;
    user: string;
    count: number;
    joined: boolean;
    joinTime: number;
    joinBlockNum: number;
    isWinner: boolean;
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


export async function getUserHistory(account: string): Promise<Array<UserHistory>> {
    const apiContract = await getApiContract();
    if (!apiContract) {
        return []
    }
    return await  apiContract.methods.getUserHistory(account).call();
}

export async function getWinnerHistory(): Promise<Array<UserHistory>> {
    const apiContract = await getApiContract();
    if (!apiContract) {
        return []
    }
    return await  apiContract.methods.getWinnerHistory().call();
}


