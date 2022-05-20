import type { NextPage } from 'next'
import Head from '../components/layouts/Head'
import styles from '../styles/Home.module.scss'
import {ArrowRightIcon, Button, CogIcon, IconButton, LinkIcon, Pane, Table} from "evergreen-ui";
import React from "react";
import LogoDivider from "../components/LogoDivider";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head />
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
                  <Button className={styles.goItems} height={48} iconAfter={ArrowRightIcon} appearance="primary">
                      浏览商品
                  </Button>
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
                          <Table.Row className={styles.rankTableHead}>
                              <Table.TextCell className={styles.headCell} flexBasis={50}>
                                 1
                              </Table.TextCell>
                              <Table.TextCell className={styles.headCell} flexBasis={500}  flexShrink={0} flexGrow={0}>
                                  ABO
                                  <LinkIcon />
                              </Table.TextCell>
                              <Table.TextCell className={styles.headCell} flexBasis={200}>16</Table.TextCell>
                              <Table.TextCell className={styles.headCell} flexBasis={200}>2</Table.TextCell>
                              <Table.TextCell className={styles.headCell} flexBasis={200}>6.12ETH</Table.TextCell>
                          </Table.Row>
                      </Table.Body>
                  </Table.Body>
              </Pane>
          </Pane>
      </main>
    </div>
  )
}

export default Home
