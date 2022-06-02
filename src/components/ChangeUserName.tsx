import React, {useEffect} from 'react';
import {Button, Dialog, Pane, TextInput, toaster} from "evergreen-ui";
import {useAppSelector} from "../app/hooks";
import {selectUserName, selectWallet} from "../feature/wallet/walletSlice";
import Comptroller from "../contracts/Comptroller.json";
import {AbiItem} from "web3-utils";
import Web3 from "web3";

const ChangeUserName = () => {
    const wallet = useAppSelector(selectWallet);
    const userName = useAppSelector(selectUserName);
    const [isShown, setIsShown] = React.useState(false)
    const [value, setValue] = React.useState(userName);
    useEffect(() => {
        setValue(userName)
    }, [userName]);

    const _changeUserName = React.useCallback(async () => {
        const web3 = new Web3(window.ethereum);
        const mainContract = new web3.eth.Contract(Comptroller.abi as AbiItem[], process.env.NEXT_PUBLIC_CONTRACT_MAIN)
        try {
            const publishResult = await mainContract.methods.changeUserName(value)
                .send({from: wallet.account, gas: 4712388, gasPrice: '1',});
            toaster.success("昵称修改成功");
        } catch (e) {
            console.error(e)
            toaster.danger("昵称修改失败");
        }
        setIsShown(false);
    }, [wallet])

    return (
        <Pane>
            <Dialog
                isShown={isShown}
                title="修改昵称"
                onCloseComplete={() => setIsShown(false)}
                onConfirm={_changeUserName}
                confirmLabel="确认"
                cancelLabel="取消"
            >
                <TextInput  onChange={(e:any) => setValue(e.target.value)} value={value} />
            </Dialog>

            <Button onClick={() => setIsShown(true)}>更改昵称</Button>
        </Pane>
    )
}

export default ChangeUserName;
