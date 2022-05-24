import type {NextPage} from 'next'
import styles from '../styles/Home.module.scss'
import {ArrowRightIcon, Button, LinkIcon, Pane, Table} from "evergreen-ui";
import React, {useEffect, useState} from "react";
import LogoDivider from "../components/LogoDivider";
import Link from "next/link";
import {useAppSelector} from "../app/hooks";
import {selectWallet} from "../feature/wallet/walletSlice";
import Web3 from "web3";
import {HttpProvider} from "web3-core";
import Comptroller from "../contracts/Comptroller.json";
import GoodLottery from "../contracts/GoodLottery.json";

import {AbiItem} from "web3-utils";

const Home: NextPage = () => {
    const [goods, setGoods] = useState<Array<any>>([]);

    const wallet = useAppSelector(selectWallet)
    const loadGoods = async (web3: Web3,contract: any) => {
        const goodAddress = await contract.methods.getGoods().call({from: wallet.account});
        const goodInfo = await Promise.all(goodAddress.map(async (good: string) => {
             const instance = new web3.eth.Contract(GoodLottery.abi as AbiItem[], good);
             const goodId = await instance.methods.goodId().call();
             const goodValue = await instance.methods.goodId().call();
             const publishTime = await instance.methods.publishTime().call();
             const lockedTime = await instance.methods.lockedTime().call();
             const maintenanceFee = await instance.methods.maintenanceFee().call();
            const winner = await instance.methods.winner().call();
            return {
                 goodId,
                 goodValue,
                 publishTime,
                 lockedTime,
                 winner
             }
        }))
        console.log(goodInfo)
        setGoods(goodInfo);
    }
    useEffect( () => {
        if(!wallet.account) {
            return;
        }
        const provider = new Web3.providers.HttpProvider(
            "HTTP://127.0.0.1:7545"
        );
        const web3 = new Web3(provider);
        const instance = new web3.eth.Contract(
            Comptroller.abi as AbiItem[],
            "0xe18031Ad81A4D3C64935550eF63a8EAF7cB4a423"
        );
        loadGoods(web3, instance)

    }, [wallet])


  return (
    <div className={styles.container}>
      <main className={styles.main}>
          <Pane display={"flex"} alignItems="center" flexDirection="column">
              <Pane display={"flex"} justifyContent={"space-between"} width={1200}>
                  <div className={styles.slogan}>
                      自由认购份额， 幸运赢取奖品。
                  </div>
                  <Pane is="img" src={"/wish2.png"} className={styles.wishImg}></Pane>
              </Pane>
              <Pane display={"flex"} justifyContent={"center"} alignItems="flex-start" flexDirection="column" width={1200}>
                  <div className={styles.subSlogan}>
                      <i>MAKEWISH</i>是一个助力实现心愿的去中心化平台。
                      购买任意份额，获取中奖概率，全流程链上公开，无法弄虚作假。
                      每次参与，您还可以获得WISH奖励！
                  </div>
                  <Link href="/goods/list" passHref>
                      <Button className={styles.goItems} height={48} iconAfter={ArrowRightIcon} appearance="primary">
                          浏览商品
                      </Button>
                  </Link>
              </Pane>
              <LogoDivider />
              <Pane marginBottom={135} width={1200}>
                  <div className={styles.rankTableTitle}>幸运排行榜</div>
                  <Table.Body className={styles.rankTable}>
                      <Table.Head className={styles.rankTableHead}>
                          <Table.TextCell className={styles.headCell} flexBasis={50}>
                              {' '}
                          </Table.TextCell>
                          <Table.TextCell className={styles.headCell} flexBasis={500} flexShrink={0} flexGrow={0}>
                              昵称
                          </Table.TextCell>
                          <Table.TextCell className={styles.headCell} flexBasis={200}>参与次数</Table.TextCell>
                          <Table.TextCell className={styles.headCell} flexBasis={200}>中奖次数</Table.TextCell>
                          <Table.TextCell className={styles.headCell} flexBasis={200}>奖品价值</Table.TextCell>
                      </Table.Head>
                      <Table.Body>
                          {goods.map(good => {
                              return <Table.Row key={good.goodId} className={styles.rankTableHead}>
                                  <Table.TextCell className={styles.headCell} flexBasis={50}>
                                      1
                                  </Table.TextCell>
                                  <Table.TextCell className={styles.headCell} flexBasis={500}  flexShrink={0} flexGrow={0}>
                                      {good.winner}
                                      <LinkIcon />
                                  </Table.TextCell>
                                  <Table.TextCell className={styles.headCell} flexBasis={200}>16</Table.TextCell>
                                  <Table.TextCell className={styles.headCell} flexBasis={200}>2</Table.TextCell>
                                  <Table.TextCell className={styles.headCell} flexBasis={200}>6.12ETH</Table.TextCell>
                              </Table.Row>
                          })}
                      </Table.Body>
                  </Table.Body>
              </Pane>
          </Pane>
      </main>
    </div>
  )
}

export default Home
