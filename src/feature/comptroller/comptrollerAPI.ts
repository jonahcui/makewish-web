import {getComptrollerContract} from "../../utils/Web3Request";
import BigNumber from "bignumber.js";

export async function exchangeAndPurchase(account: string, id: number, amount: BigNumber, value: BigNumber) {
    const comptrollerContract = await getComptrollerContract();
    if (!comptrollerContract) {
        return null
    }
    console.log(id, amount.toString(), account, value.toString())
    return await  comptrollerContract.methods.exchangeAndJoin(id, amount.toString()).send({
        from: account,
        value: value.toString(),
        gas: 110000
    });
}
