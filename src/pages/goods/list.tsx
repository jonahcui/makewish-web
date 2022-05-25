import type {NextPage} from 'next'
import styles from '../../styles/goods/GoodsList.module.scss'
import {Button, Card, Pane,} from "evergreen-ui";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import Web3 from "web3";
import {AbiItem} from "web3-utils";
import WishApi from "../../contracts/WishApi.json";
import {getApiContract, getWeb3} from "../../utils/Web3Request";
import GoodCard from "../../components/GoodCard";
import wallet from "../../components/layouts/Wallet";
import {useAppSelector} from "../../app/hooks";
import {selectWallet} from "../../feature/wallet/walletSlice";

const List: NextPage = () => {
    const {configuration: {networkAddress, mainContractAddress, apiContractAddress}} = useAppSelector(selectWallet)
    const [web3, setWeb3] = useState<Web3>()
    const [apiContract, setApiContract] = useState()
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [size, setSize] = useState<number>(20);

    const loadGoods = async () => {
        if (typeof window === 'undefined') {
            return
        }
        const instance = await getApiContract();
        if (!instance) {
            return;
        }
        const length = await instance.methods.getGoodsLength().call();
        // @ts-ignore
        setApiContract(instance)
        setWeb3(web3)
        setTotalRecords(length)
    }

    useEffect(() => {
        loadGoods()
    }, [wallet]);

    if (typeof window === 'undefined') {
        return <div />
    }

    const _renderGoods = () => {
        const l = totalRecords > size ? size: totalRecords;
        const result = [];
        if (!web3 || !apiContract) {
            return []
        }
        for (let i = 0; i < l; i++) {
            console.log("render.....");
            // @ts-ignore
            result.push(<GoodCard  key={totalRecords - i - 1} web3={web3} contract={apiContract} index={totalRecords - 1 - i} />);
        }
        return result;
    }

    return <div>
        <Pane display={"flex"} flexWrap={"wrap"} background={"#000000"} padding={52} minHeight={"100vh"}>
            {
                _renderGoods()
            }
        </Pane>
    </div>
}

export default List;
