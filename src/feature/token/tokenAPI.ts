import {getApiContract, getTokenContract} from "../../utils/Web3Request";

export async function getUserBalance(account: string) {
    const tokenContract = await getTokenContract();
    if (!tokenContract) {
        return null
    }
    return await tokenContract.methods.balanceOf(account).call();
}
