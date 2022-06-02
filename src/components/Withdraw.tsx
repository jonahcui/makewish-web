import React, {useEffect} from 'react';
import {Button, Dialog, Pane, TextInput, toaster} from "evergreen-ui";
import {useAppSelector} from "../app/hooks";
import {selectUserName, selectWallet} from "../feature/wallet/walletSlice";
import Comptroller from "../contracts/Comptroller.json";
import {AbiItem} from "web3-utils";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import _ from "lodash";

const Withdraw = () => {
    const wallet = useAppSelector(selectWallet);
    const [isShown, setIsShown] = React.useState(false)
    const [value, setValue] = React.useState<string>('0');

    const _withdraw = React.useCallback(async () => {
        const web3 = new Web3(window.ethereum);
        const mainContract = new web3.eth.Contract(Comptroller.abi as AbiItem[], process.env.NEXT_PUBLIC_CONTRACT_MAIN)
        try {
            const decimal = new BigNumber(10).exponentiatedBy(18);
            const v  = new BigNumber(value).times(decimal).toPrecision();
            console.log(v);
            const result = await mainContract.methods.withdraw(v)
                .send({from: wallet.account, gas: 4712388, gasPrice: '1',});
            toaster.success("提现成功");
        } catch (e) {
            toaster.danger("提现失败");
        }
        setIsShown(false);
    }, [wallet, value])

    const _changeValue = (e: any) => {
        const v: string = e.target.value;
        if (!_.isInteger(_.toNumber(v))) {
            toaster.danger("请输入有效数字，必须是整数")
            setValue('1')
        } else if (v.indexOf(".") > -1) {
            toaster.danger("请输入有效数字，必须是整数")
            setValue('1')
        } else {
            setValue(v)
        }
    }

    return (
        <Pane>
            <Dialog
                isShown={isShown}
                title="提现"
                onCloseComplete={() => setIsShown(false)}
                onConfirm={_withdraw}
                confirmLabel="提现"
                cancelLabel="取消"
            >
                <TextInput  onChange={_changeValue} value={value} />
            </Dialog>

            <Button onClick={() => setIsShown(true)}>提现</Button>
        </Pane>
    )
}

export default Withdraw;
