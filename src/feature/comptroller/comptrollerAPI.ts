import {getComptrollerContract} from "../../utils/Web3Request";

export async function getUserTickets(index: number, account: string) {
    const apiContract = await getComptrollerContract();
    if (!apiContract) {
        return null
    }
    return await  apiContract.methods.getUserTickets(index, account).call();
}
