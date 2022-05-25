import {getApiContract, getComptrollerContract, getGoodContract} from "../../utils/Web3Request";
import BigNumber from "bignumber.js";

export async function exchangeAndPurchase(account: string, id: number, amount: BigNumber, value: BigNumber) {
    const comptrollerContract = await getComptrollerContract();
    if (!comptrollerContract) {
        return null
    }
    console.log(comptrollerContract, id, amount.toString(), account, value.toString())
    return await  comptrollerContract.methods.exchangeAndJoin(id, amount).send({
        from: account,
        value: value.toString(),
        gas: 500000,
        gasPrice: 20000000000
    });
}

export async function pickWinner(index: number, from: string) {
    const comptrollerContract = await getComptrollerContract();
    if (!comptrollerContract) {
        return null
    }
    const address = await comptrollerContract.methods.allGoods(index).call();
    const instance = await getGoodContract(address);
    if (!instance) {
        return null;
    }
    const resp = instance.methods.pickWinner().call({
        from,
        gas: 500000,
        gasPrice: 20000000000
    })
    return instance.methods.pickWinner().send({
        from,
        gas: 1000000,
        gasPrice: 20000000000
    })
}
