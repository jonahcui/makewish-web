import type {NextPage} from 'next'
import styles from '../styles/Home.module.scss'
import {ArrowRightIcon, Button, LinkIcon, Pane, Table} from "evergreen-ui";
import React, {useEffect, useState} from "react";
import LogoDivider from "../components/LogoDivider";
import Link from "next/link";
import {formatTime} from "../utils/time";
import Web3 from "web3";
import WishApi from "../contracts/WishApi.json";
import {AbiItem} from "web3-utils";
import {useAppSelector} from "../app/hooks";
import {selectWallet} from "../feature/wallet/walletSlice";
import {openAddress, openBlock} from "../utils/explore";
import user from "./user";

const Home: NextPage = () => {
    const [ranks, setRanks] = useState<Array<any>>([]);
    const {configuration: {networkAddress, mainContractAddress, apiContractAddress}} = useAppSelector(selectWallet)

    const loadHistory = async () => {
        const provider = new Web3.providers.HttpProvider(networkAddress);
        const web3 = new Web3(provider);
        const instance = new web3.eth.Contract(WishApi.abi as AbiItem[], apiContractAddress);
        const histories =  await instance.methods.getWinnerHistory().call();
        setRanks(histories.filter((h: any) => h.user.indexOf("0x0000000000000000") < 0));
    }

    useEffect(() => {
        loadHistory()
    }, [networkAddress]);


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
                  <div className={styles.rankTableTitle}>幸运用户</div>
                  <Table.Body className={styles.rankTable}>
                      <Table.Head className={styles.rankTableHead}>
                          <Table.TextCell className={styles.headCell} flexBasis={50}>
                              {' '} 商品
                          </Table.TextCell>
                          <Table.TextCell className={styles.headCell} flexBasis={500} flexShrink={0} flexGrow={0}>
                              地址
                          </Table.TextCell>
                          <Table.TextCell className={styles.headCell} flexBasis={100}>参与次数</Table.TextCell>
                          <Table.TextCell className={styles.headCell} flexBasis={200}>中奖时间</Table.TextCell>
                          <Table.TextCell className={styles.headCell} flexBasis={200}>奖品价值</Table.TextCell>
                      </Table.Head>
                      <Table.Body>
                          {ranks.map(rank => {
                              return <Table.Row key={rank.goodId} className={styles.rankTableHead}>
                                  <Table.TextCell className={styles.headCell} flexBasis={50}>
                                      {rank.goodId}
                                  </Table.TextCell>
                                  <Table.TextCell className={styles.headCell} flexBasis={500}  flexShrink={0} flexGrow={0} onClick={() => openAddress(rank.user)}>
                                      {rank.user}
                                      <LinkIcon />
                                  </Table.TextCell>
                                  <Table.TextCell className={styles.headCell} flexBasis={100}>{rank.count}</Table.TextCell>
                                  <Table.TextCell className={styles.headCell} flexBasis={200} onClick={() => openBlock(rank.blockNum)}
                                  >{formatTime(rank.blockTime)}</Table.TextCell>
                                  <Table.TextCell className={styles.headCell} flexBasis={200}>{rank.goodValue} WISH</Table.TextCell>
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
