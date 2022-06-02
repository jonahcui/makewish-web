import {NextPage} from "next";
import {useAppSelector} from "../app/hooks";
import {selectWallet} from "../feature/wallet/walletSlice";
import {getUserHistory, UserHistory} from "../feature/goods/goodsAPI";
import React, {useEffect, useState} from "react";
import {LinkIcon, Pane, Table, TagIcon, Text} from "evergreen-ui";
import styles from "../styles/History.module.scss"
import {formatNumber, formatTime} from "../utils/time";
import {openBlock} from "../utils/explore";
import {useRouter} from "next/router";


const History: NextPage = () => {
    const wallet = useAppSelector(selectWallet)
    const [histories, setHistories] = useState<Array<UserHistory>>([]);

    const loadHistory = async () => {
        if (!wallet.account) {
            setHistories([])
            return;
        }
        const histories = await getUserHistory(wallet.account as string);
        console.log(histories)
        setHistories(histories.filter(h => h.user.indexOf("0x0000000000000000")  < 0));
    }

    useEffect(() => {
        loadHistory()
    }, [wallet.account]);
    const router = useRouter();


    return <main className={styles.main}>
        <Pane display={"flex"} alignItems="center" flexDirection="column">
            <div className={styles.title} onClick={loadHistory}>
                您的认购参与记录
            </div>
            <Pane marginBottom={135} width={1200}>
                <div className={styles.text26} style={{textAlign: "center", marginBottom: 10, marginTop: 30}}>本商品认购参与记录</div>
                <Table.Body style={{backgroundColor: "black"}}>
                    <Table.Head style={{backgroundColor: "black"}}>
                        <Table.TextCell className={styles.headCell} flexBasis={100}>商品</Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={200}>认购份额</Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={300} flexShrink={0} flexGrow={0}>交易block</Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={300}>交易时间</Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={200}>奖金</Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={200}>返还金额</Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={150}>{' '}</Table.TextCell>
                    </Table.Head>
                    <Table.Body style={{backgroundColor: "black"}}>
                        {/*{goodInfo && renderTableRows()}*/}
                        {/*{userRecords.map(userRecord => <UserRow key={userRecord.user} record={userRecord} />)}*/}
                        {histories.map((history,index) => {
                            return <Table.Row key={history.goodId} className={styles.rankTableHead} style={{backgroundColor: "black"}}>
                                <Table.TextCell className={styles.dataCell} flexBasis={100}
                                                style={{cursor: "pointer"}}
                                                onClick={() => router.push(`/goods/` + history?.goodIndex)}>{history.goodId}</Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={200}>{history.count}</Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={300}
                                                style={{cursor: "pointer"}}
                                                onClick={() => openBlock(history.joinBlockNum)}>
                                    {history.joinBlockNum}
                                    <LinkIcon style={{marginLeft: 10}} />
                                </Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={300}>{formatTime(history.joinTime)}</Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={200}>{history.goodValue}</Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={200}>{formatNumber(history.paybackFee)}</Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={150} >
                                    {history.isWinner ? <span style={{backgroundColor: "#E49800", paddingLeft: 10, paddingRight: 10, fontWeight: "bold"}}>WIN</span> : ''}
                                </Table.TextCell>
                            </Table.Row>
                        })}
                    </Table.Body>
                </Table.Body>
            </Pane>
        </Pane>
    </main>
}

export default History;
