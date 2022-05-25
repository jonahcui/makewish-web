import {getApiContract, getComptrollerContract, getGoodContract} from "../../utils/Web3Request";
import BigNumber from "bignumber.js";

export async function exchangeAndPurchase(account: string, id: number, amount: BigNumber, value: BigNumber) {
    const comptrollerContract = await getComptrollerContract();
    if (!comptrollerContract) {
        return null
    }
    console.log(comptrollerContract, id, amount.toPrecision(), account, value.toPrecision())
    let gasPrice = new BigNumber(1000000);

    for (let i = 0; i < 5; i++) {
        try {
            const e = await comptrollerContract.methods.exchangeAndJoin(id, amount).call({
                from: account,
                value: value.toPrecision(),
                gas: gasPrice.toPrecision(),
                gasPrice: 1
            });
            break;
        } catch (e) {
            gasPrice = gasPrice.times(2)
            if (gasPrice.gt(new BigNumber(process.env.NEXT_PUBLIC_GAS_LIMIT as string))) {
                gasPrice = new BigNumber(process.env.NEXT_PUBLIC_GAS_LIMIT as string)
            }
        }
    }
    console.log(gasPrice.toPrecision())
    return await  comptrollerContract.methods.exchangeAndJoin(id, amount).send({
        from: account,
        value: value.toPrecision(),
        gas: gasPrice.toPrecision(),
        gasPrice: 1
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
    return instance.methods.pickWinner().send({
        from,
        gas: 1000000,
        gasPrice: 1
    })
}
