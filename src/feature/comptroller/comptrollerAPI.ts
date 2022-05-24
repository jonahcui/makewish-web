import {getComptrollerContract} from "../../utils/Web3Request";
import BigNumber from "bignumber.js";

export async function exchangeAndPurchase(account: string, id: number, amount: BigNumber, value: BigNumber) {
    const comptrollerContract = await getComptrollerContract();
    if (!comptrollerContract) {
        return null
    }
    console.log(comptrollerContract, id, amount.toString(), account, value.toString())
    return await  comptrollerContract.methods.exchangeAndJoin('12', '1').send({
        // from: account,
        // value: value.toString(),
        from: '0x8c28ec2f92d3cef3fa6be6d2d6f1c7d97101d07f',
        value: '1000000000000000000',
        gas: 120000,
        gasPrice: 20000000000
    });
}
