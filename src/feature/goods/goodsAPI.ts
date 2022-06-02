import {getApiContract, readJSONFromIPFS} from "../../utils/Web3Request";

export interface GoodInfo {
    goodIndex: number
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
    isNft?:boolean
    nftTokenContractAddress?: string
    tokenId?: string
    tokenURL?: string
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
    goodIndex: number;
    goodId: number;
    user: string;
    count: number;
    joined: boolean;
    joinTime: number;
    goodValue: number;
    paybackFee: number;
    joinBlockNum: number;
    isWinner: boolean;
}

export interface NftGoodHistory extends GoodInfo{
    nftAddress: string
    tokenId: string
    status: number
    goodAddress: string
    tokenURL?: string
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
        try {
            const goodInfoInIPFS = await readJSONFromIPFS(res?.goodHash)
            return {...goodInfoInIPFS, ...res}
        } catch (e) {
            return res
        }
    }

    return {...res}

}

export async function getGoodInfos(): Promise<Array<GoodInfo>> {
    const apiContract = await getApiContract();
    if (!apiContract) {
        return []
    }
    const res = await apiContract.methods.getGoods().call();
    const result = []
    for (let i = 0; i < res.length; i++) {
        let good  = {...res[i]}
        if (res[i]?.goodHash) {
            try {
                const goodInfoInIPFS = await readJSONFromIPFS(res[i]?.goodHash)
                good = {...goodInfoInIPFS, ...good,}
            } catch (e) {
                good = {...good, goodName: good.goodId, goodImage: "/wish.png"}
            }
        }
        result.push(good);
    }


    return result;

}

export async function getUserRecord(index: number, num: number) {
    const apiContract = await getApiContract();
    if (!apiContract) {
        return null
    }
    return await  apiContract.methods.getUserRecord(index, num).call();
}

export async function getUserRecords(index: string) {
    const apiContract = await getApiContract();
    if (!apiContract) {
        return []
    }
    try {
        return await apiContract.methods.getUserRecords(index).call();
    } catch (e) {
        console.log("查询用户参与记录失败", e)
        return []
    }
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


export async function getUserPublishedGoods(address: string) {
    const tokenContract = await getApiContract();
    if (!tokenContract) {
        return []
    }

    const res = await tokenContract.methods.getUserPublishedGoods(address).call();
    const result = []
    for (let i = 0; i < res.length; i++) {
        let good  = {...res[i]}
        if (res[i]?.goodHash) {
            try {
                const goodInfoInIPFS = await readJSONFromIPFS(res[i]?.goodHash)
                good = {...goodInfoInIPFS, ...good,}
            } catch (e) {
                good = {...good, goodName: good.goodId, goodImage: "/wish.png"}
            }
        }
        result.push(good);
    }

    return result;
}


