import {NextPage} from "next";
import {useAppSelector} from "../app/hooks";
import {selectWallet} from "../feature/wallet/walletSlice";
import {getUserHistory, UserHistory} from "../feature/goods/goodsAPI";
import React, {useEffect, useState} from "react";
import {LinkIcon, Pane, Table} from "evergreen-ui";
import styles from "../styles/History.module.scss"
import {formatTime} from "../utils/time";


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
        setHistories(histories);
    }

    useEffect(() => {
        loadHistory()
    }, [wallet.account]);


    return <main className={styles.main}>
        <Pane display={"flex"} alignItems="center" flexDirection="column">
            <div className={styles.title}>
                您的认购参与记录
            </div>
            <Pane marginBottom={135} width={1200}>
                <div className={styles.text26} style={{textAlign: "center", marginBottom: 10, marginTop: 30}}>本商品认购参与记录</div>
                <Table.Body style={{backgroundColor: "black"}}>
                    <Table.Head style={{backgroundColor: "black"}}>
                        <Table.TextCell className={styles.headCell} flexBasis={100}>商品</Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={100}>认购份额</Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={500} flexShrink={0} flexGrow={0}>首次交易hash</Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={300}>首次认购时间</Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={200}>认购金额</Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={50}>{' '}</Table.TextCell>
                    </Table.Head>
                    <Table.Body style={{backgroundColor: "black"}}>
                        {/*{goodInfo && renderTableRows()}*/}
                        {/*{userRecords.map(userRecord => <UserRow key={userRecord.user} record={userRecord} />)}*/}
                        {histories.map((history,index) => {
                            return <Table.Row className={styles.rankTableHead} style={{backgroundColor: "black"}}>
                                <Table.TextCell className={styles.dataCell} flexBasis={100}>{history.goodId}</Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={100}>{history.count}</Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={500}>
                                    {history.joinBlockNum}
                                    <LinkIcon style={{marginLeft: 10}} />
                                </Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={300}>{formatTime(history.joinTime)}</Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={200}>{history.count} WISH</Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={50}>
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
