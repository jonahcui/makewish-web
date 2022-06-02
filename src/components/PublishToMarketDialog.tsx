import React, {useState} from 'react';
import {Button, Dialog, Pane, toaster} from "evergreen-ui";
import {NftGoodHistory} from "../feature/goods/goodsAPI";
import Web3 from "web3";
import GoodLotteryNFT from "../contracts/GoodLotteryNFT.json";
import {AbiItem} from "web3-utils";
import {useAppSelector} from "../app/hooks";
import {selectWallet} from "../feature/wallet/walletSlice";

interface Props {
    isShown: boolean;
    setIsShown: Function;
    goodInfo: NftGoodHistory | null;
    onRefresh?: Function
}

const PublishToMarketDialog: React.FC<Props> = ({isShown, setIsShown, goodInfo, onRefresh}) => {
    const wallet = useAppSelector(selectWallet);
    const _publishToMarket = React.useCallback(async () => {
        if (!goodInfo) {
            return;
        }

        const web3 = new Web3(window.ethereum);
        const instance = new web3.eth.Contract(GoodLotteryNFT.abi as AbiItem[], goodInfo.goodAddress);

        const resp = await instance.methods.publishToMarket()
            .send({from: wallet.account, gas: 4712388, gasPrice: '20000000000',});

        setIsShown(false);
        toaster.success("发布成功")
        if (onRefresh) {
            onRefresh();
        }
    }, [wallet, goodInfo, onRefresh])

    return <Pane>
    <Dialog
        isShown={isShown}
        title="将商品发布到市场"
        intent="danger"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="发布"
        onConfirm={() => _publishToMarket()}
    >
        将该商品发布到市场后，所有人将会看到这个商品
    </Dialog>

</Pane>
}

export default PublishToMarketDialog;
