import type { NextPage } from 'next'
import styles from '../../styles/goods/GoodsDetail.module.scss'
import {ArrowRightIcon, Button, Card, CogIcon, IconButton, LinkIcon, Pane, Table, TextInput} from "evergreen-ui";
import React from "react";
import Head from "../../components/layouts/Head";
import LogoDivider from "../../components/LogoDivider";
import classNames from "classnames";
import {margin} from "glamor/utils";

const Detail: NextPage = () => {
    return <div>
        <Head />
        <main className={styles.main}>
            <Pane display={"flex"} alignItems="center" flexDirection="column">
                <Pane display={"flex"} justifyContent={"center"} marginTop={50}>
                    <Pane>
                        <Pane is="img" src={"/wish2.png"}></Pane>
                        <div className={styles.stateText}>等待开奖结果</div>
                    </Pane>
                    <Pane marginBottom={50} width={500}>
                        <div className={styles.text26} style={{marginBottom: 8}}>这里展示商品的名称，一行肯定够用了</div>
                        <div className={styles.text18} style={{marginBottom: 8}}>商品唯一ID</div>
                        <div className={classNames(styles.text18, styles.borderBottom)} style={{marginBottom: 8}}>市场价值: 0.6 ETH</div>
                        <div className={styles.text22} style={{marginBottom: 16}}>
                            <span style={{marginRight: 20}}>
                            份额单价: <b>0.01</b> ETH
                            </span>
                            <span>
                            剩余可认购份额: <b>0</b>/60
                            </span>
                        </div>
                        <Pane paddingX={46} paddingY={17} paddingBottom={30} background={"#292929"}>
                            <div className={styles.text16} style={{marginBottom: 4}}>
                                填写你的认购份额
                            </div>
                            <div className={styles.text22} style={{marginBottom: 8}}>
                                <TextInput  />
                                <span className={styles.primaryColor} style={{marginLeft: 10}}>
                                MAX
                                </span>
                            </div>
                            <div className={styles.text16} style={{marginBottom: 4}}>认购花费金额</div>
                            <div>
                                <span
                                    className={classNames(styles.text22, styles.primaryColor)}>0.01</span>
                                <span className={styles.text18}>{' '}ETH {' '}($201.21)</span>
                            </div>
                            <div className={classNames(styles.text26, styles.purchaseBtn)}>
                                <i>MAKEWISH</i>
                            </div>
                        </Pane>
                        <div className={classNames(styles.text18)} style={{marginBottom: 4, marginTop: 4}}>
                            <i>
                                每次成功参与，都将获得对应WISH代币奖励
                            </i>
                        </div>
                        <Pane paddingX={46} paddingY={17} paddingBottom={30} background={"#292929"}>
                            <div className={styles.text16}>已拥有抽奖码</div>
                            <Pane display={"flex"} flexWrap={"wrap"} gap={8}>
                                <div className={styles.text14}>100000123</div>
                                <div className={styles.text14}>100000123</div>
                                <div className={styles.text14}>100000123</div>
                                <div className={styles.text14}>100000123</div>
                                <div className={styles.text14}>100000123</div>
                                <div className={styles.text14}>100000123</div>
                            </Pane>
                        </Pane>
                    </Pane>
                </Pane>
                {/*  divider  */}
                <LogoDivider />
                {/* join record */}
                <Pane marginBottom={135} width={1200}>
                    <div className={styles.text26} style={{textAlign: "center", marginBottom: 10, marginTop: 30}}>本商品认购参与记录</div>
                    <Table.Body style={{backgroundColor: "black"}}>
                        <Table.Head style={{backgroundColor: "black"}}>
                            <Table.TextCell className={styles.headCell} flexBasis={200}>昵称</Table.TextCell>
                            <Table.TextCell className={styles.headCell} flexBasis={200}>认购份额</Table.TextCell>
                            <Table.TextCell className={styles.headCell} flexBasis={500}  flexShrink={0} flexGrow={0}>账户地址</Table.TextCell>
                            <Table.TextCell className={styles.headCell} flexBasis={200}>认购时间</Table.TextCell>
                            <Table.TextCell className={styles.headCell} flexBasis={200}>认购金额</Table.TextCell>
                            <Table.TextCell className={styles.headCell} flexBasis={50}>{' '}</Table.TextCell>
                        </Table.Head>
                        <Table.Body style={{backgroundColor: "black"}}>
                            <Table.Row className={styles.rankTableHead} style={{backgroundColor: "black"}}>
                                <Table.TextCell className={styles.dataCell} flexBasis={200}>Fixed width</Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={200}>Flex me col 2</Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={500}>Flex me col 3</Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={200}>Flex me col 3</Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={200}>Flex me col 3</Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={50}>
                                    <LinkIcon />
                                </Table.TextCell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Body>
                </Pane>
            </Pane>
        </main>
    </div>
}

export default Detail;
