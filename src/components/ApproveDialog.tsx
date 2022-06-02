import React, {useState} from 'react';
import {Button, Dialog, Pane, toaster} from "evergreen-ui";
import {NftGoodHistory} from "../feature/goods/goodsAPI";
import Web3 from "web3";
import SimpleNFT from "../contracts/SimpleNFT.json";
import {AbiItem} from "web3-utils";
import {useAppSelector} from "../app/hooks";
import {selectWallet} from "../feature/wallet/walletSlice";

interface Props {
    isShown: boolean;
    setIsShown: Function;
    goodInfo: NftGoodHistory | null;
    onRefresh?: Function
}

const ApproveDialog: React.FC<Props> = ({isShown, setIsShown, goodInfo, onRefresh}) => {
    const wallet = useAppSelector(selectWallet);
    const _approve = React.useCallback(async () => {
        if (!goodInfo) {
            return;
        }

        const web3 = new Web3(window.ethereum);
        const instance = new web3.eth.Contract(SimpleNFT.abi as AbiItem[], goodInfo.nftAddress);

        const resp = await instance.methods.approve(goodInfo.goodAddress, goodInfo.tokenId)
            .send({from: wallet.account, gas: 4712388, gasPrice: '20000000000',});

        setIsShown(false);
        toaster.success("授权成功")
        if (onRefresh) {
            onRefresh();
        }
    }, [wallet, goodInfo, onRefresh])

    return <Pane>
    <Dialog
        isShown={isShown}
        title="授权NFT给商品合约"
        intent="danger"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="授权"
        onConfirm={() => _approve()}
    >
        授权该商品合约可以处理您的NFT商品（并不会立即转移您的财产）.
    </Dialog>

</Pane>
}

export default ApproveDialog;
