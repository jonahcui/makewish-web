import type {NextPage} from 'next'
import styles from '../styles/Home.module.scss'
import {ArrowRightIcon, Button, LinkIcon, Pane, Table, Text} from "evergreen-ui";
import React, {useEffect, useState} from "react";
import LogoDivider from "../components/LogoDivider";
import Link from "next/link";
import {formatTime} from "../utils/time";
import Web3 from "web3";
import WishApi from "../contracts/WishApi.json";
import {AbiItem} from "web3-utils";
import {openAddress, openBlock} from "../utils/explore";
import {readJSONFromIPFS} from "../utils/Web3Request";

const Home: NextPage = () => {
    const [ranks, setRanks] = useState<Array<any>>([]);
    const [goodNames, setGoodNames] = useState<Record<number, string>>({});

    const loadHistory = async () => {
        const provider = new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_ETH_RPC_URL as string);
        const web3 = new Web3(provider);
        const instance = new web3.eth.Contract(WishApi.abi as AbiItem[], process.env.NEXT_PUBLIC_CONTRACT_API as string);
        try {
            const histories =  await instance.methods.getWinnerHistory().call();
            setRanks(histories.filter((h: any) => h.user.indexOf("0x0000000000000000") < 0));
            loadGoodNames()
        } catch (e) {
            console.error("查询幸运用户失败", e);
        }
    }

    const loadGoodNames = async () => {
        if (!ranks || ranks.length === 0) {
            return;
        }
        const result: Record<number, string> = {}
        for (let i = 0; i < ranks.length; i++) {
            const rank = ranks[i];
            if (rank.fileHash) {
                try {
                    const json = await readJSONFromIPFS(rank.fileHash);
                    console.log(json);
                    if (json.goodName) {
                        result[json.goodId] = json.goodName;
                    }
                } catch (e) {
                    continue;
                }
            }
        }
        setGoodNames(result);
        return result;
    }

    useEffect(() => {
        loadHistory()
    }, []);




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
                              <Text size={400} color={"#F1F1F1"}>
                              {' '} 商品
                              </Text>
                          </Table.TextCell>
                          <Table.TextCell className={styles.headCell} flexBasis={150}>
                              <Text size={400} color={"#F1F1F1"}>
                              商品名称
                              </Text>
                          </Table.TextCell>
                          <Table.TextCell className={styles.headCell} flexBasis={300} flexShrink={0} flexGrow={0}>

                              <Text size={400} color={"#F1F1F1"}>
                              地址
                              </Text>
                          </Table.TextCell>
                          <Table.TextCell className={styles.headCell} flexBasis={80}>
                              <Text size={400} color={"#F1F1F1"}>
                                  参与次数
                              </Text>
                          </Table.TextCell>
                          <Table.TextCell className={styles.headCell} flexBasis={200}>
                              <Text size={400} color={"#F1F1F1"}>
                              中奖时间
                              </Text>
                          </Table.TextCell>
                          <Table.TextCell className={styles.headCell} flexBasis={200}>
                              <Text size={400} color={"#F1F1F1"}>
                              奖品价值
                              </Text>
                          </Table.TextCell>
                      </Table.Head>
                      <Table.Body>
                          {ranks.map(rank => {
                              return <Table.Row key={rank.goodId} className={styles.rankTableHead}>
                                  <Table.TextCell className={styles.headCell} flexBasis={50}>

                                      <Text size={300} color={"#F1F1F1"}>
                                      {rank.goodId}
                                      </Text>
                                  </Table.TextCell>
                                  <Table.TextCell className={styles.headCell} flexBasis={150}>
                                      <Text size={300} color={"#F1F1F1"}>
                                      {goodNames[rank.goodId]}
                                      </Text>
                                  </Table.TextCell>
                                  <Table.TextCell className={styles.headCell} flexBasis={300}  flexShrink={0} flexGrow={0} onClick={() => openAddress(rank.user)}>
                                      <Text size={300} color={"#F1F1F1"}>
                                          {rank.user}
                                      </Text>
                                      <LinkIcon />
                                  </Table.TextCell>
                                  <Table.TextCell className={styles.headCell} flexBasis={80}>
                                      <Text size={300} color={"#F1F1F1"}>
                                      {rank.count}
                                      </Text>
                                  </Table.TextCell>
                                  <Table.TextCell className={styles.headCell} flexBasis={200} onClick={() => openBlock(rank.blockNum)}
                                  >
                                      <Text size={300} color={"#F1F1F1"}>
                                      {formatTime(rank.blockTime)}
                                      </Text>
                                  </Table.TextCell>
                                  <Table.TextCell className={styles.headCell} flexBasis={200}>
                                      <Text size={300} color={"#F1F1F1"}>
                                      {rank.goodValue}
                                      WISH
                                      </Text>
                                  </Table.TextCell>
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
