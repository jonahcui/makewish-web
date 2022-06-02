import {NextPage} from "next";
import {useAppSelector} from "../app/hooks";
import {selectWallet} from "../feature/wallet/walletSlice";
import {getUserPublishedGoods, NftGoodHistory} from "../feature/goods/goodsAPI";
import React, {useEffect, useState} from "react";
import {Badge, Button, Pane, Table, Text} from "evergreen-ui";
import styles from "../styles/History.module.scss"
import {useRouter} from "next/router";
import {getGoodStatus, GoodStatus} from "../utils/StatusUtils";
import PublishNftGood from "../components/PublishNftGood";
import NftGoodInfo from "../components/NftGoodInfo";
import ApproveDialog from "../components/ApproveDialog";
import PublishToMarketDialog from "../components/PublishToMarketDialog";

const NFTGoodStatus = ({status, goodInfo} : any) => {
    console.log(status, goodInfo)
    const goodStatus = getGoodStatus(goodInfo);

    if (status + '' == '1') {
        if (goodStatus == GoodStatus.UN_START) {
            return <Badge color="blue">
                未开始
            </Badge>
        }
        if (goodStatus == GoodStatus.NON_GOOD) {
            return <Badge color="blue">
                未开始
            </Badge>
        }
        if (goodStatus == GoodStatus.IN_PROGRESS) {
            return <Badge color="blue">
                进行中
            </Badge>
        }
        if (goodStatus == GoodStatus.LOCKED) {
            return <Badge color="blue">
                已锁定
            </Badge>
        }
        if (goodStatus == GoodStatus.SUCCESS) {
            return <Badge color="blue">
                成功
            </Badge>
        }
    } else if (status + '' == '2') {
        return <Badge color="red">
            已授权，未发布
        </Badge>
    } else if (status + '' == '3') {
        return <Badge color="red">
            未授权
        </Badge>
    }
    return <div />
}

const History: NextPage = () => {
    const wallet = useAppSelector(selectWallet)
    const router = useRouter();
    const [histories, setHistories] = useState<Array<NftGoodHistory>>([]);
    const [isInfoShown, setIsInfoShown] = useState(false);
    const [isApproveShown, setIsApproveShown] = useState(false);
    const [isPublishToMarket, setIsPublishToMarket] = useState(false);

    const [currentGood, setCurrentGood] = useState<NftGoodHistory | null>(null);

    const loadHistory = async () => {
        if (!wallet.account) {
            setHistories([])
            return;
        }
        const histories = await getUserPublishedGoods(wallet.account as string);
        setHistories(histories);
    }

    const _showInfo = (good: NftGoodHistory) => {
        if (good.status + '' === '1') {
            router.push(`/goods/` + good?.goodIndex);
        } else {
            setIsInfoShown(true)
            setCurrentGood(good)
        }
    }



    useEffect(() => {
        loadHistory()
    }, []);


    useEffect(() => {
        loadHistory()
    }, [wallet]);

    return <main className={styles.main}>
        <Pane display={"flex"} alignItems="center" flexDirection="column">
            <div className={styles.title} onClick={loadHistory}>
                我发布的商品
                <div style={{float:"right"}}>
                    <PublishNftGood onCreateSuccess={loadHistory} />
                </div>
            </div>
            <Pane marginBottom={135} width={1200}>
                <div className={styles.text26} style={{textAlign: "center", marginBottom: 10, marginTop: 30}}>本商品认购参与记录</div>
                <Table.Body style={{backgroundColor: "black"}}>
                    <Table.Head style={{backgroundColor: "black"}}>
                        <Table.TextCell className={styles.headCell} flexBasis={200}>
                            <Text size={400} color={"#F1F1F1"}>
                                商品
                            </Text>
                        </Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={200}>
                            <Text size={400} color={"#F1F1F1"}>
                                商品价值
                            </Text>
                        </Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={300} flexShrink={0} flexGrow={0}>
                            <Text size={400} color={"#F1F1F1"}>
                                NFT Provider
                            </Text>
                        </Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={300}>
                            <Text size={400} color={"#F1F1F1"}>
                                NFT Token
                            </Text>
                        </Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={200}>
                            <Text size={400} color={"#F1F1F1"}>
                                状态
                            </Text>
                        </Table.TextCell>
                        <Table.TextCell className={styles.headCell} flexBasis={200}>
                            <Text size={400} color={"#F1F1F1"}>
                                {'操作'}
                            </Text>
                        </Table.TextCell>
                    </Table.Head>
                    <Table.Body style={{backgroundColor: "black"}}>
                        {/*{goodInfo && renderTableRows()}*/}
                        {/*{userRecords.map(userRecord => <UserRow key={userRecord.user} record={userRecord} />)}*/}
                        {histories.map((history,index) => {
                            return <Table.Row key={history.goodId} className={styles.rankTableHead} style={{backgroundColor: "black"}}>
                                <Table.TextCell className={styles.dataCell} flexBasis={200}
                                                style={{cursor: "pointer"}}
                                                onClick={() => _showInfo(history)}>
                                    <Text size={300} color={"#F1F1F1"}>
                                        {history.goodId} - {history.goodName}
                                    </Text>
                                </Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={200}>
                                    <Text size={300} color={"#F1F1F1"}>
                                        {history.goodValue} WISH
                                    </Text>
                                </Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={300}>
                                    <Text size={300} color={"#F1F1F1"}>
                                        {history.nftAddress}
                                    </Text>
                                </Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={300}>
                                    <Text size={300} color={"#F1F1F1"}>
                                        {history.tokenId}
                                    </Text>
                                </Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={200}>
                                    <NFTGoodStatus status={history.status} goodInfo={history} />
                                </Table.TextCell>
                                <Table.TextCell className={styles.dataCell} flexBasis={200}>
                                    <Button marginRight={16} size="small" intent="none"
                                            onClick={() => {
                                                setCurrentGood(history)
                                                setIsApproveShown(true)
                                            }}
                                            disabled={history.status + '' !== '3'}>
                                        授权
                                    </Button>
                                    <Button marginRight={16} size="small" intent="none" disabled={history.status + '' !== '2'}
                                            onClick={() => {
                                                setCurrentGood(history)
                                                setIsPublishToMarket(true)
                                            }}
                                    >
                                        发布
                                    </Button>
                                </Table.TextCell>
                            </Table.Row>
                        })}
                    </Table.Body>
                </Table.Body>
            </Pane>
            <NftGoodInfo isShown={isInfoShown} setIsShown={setIsInfoShown} goodInfo={currentGood} />
            <ApproveDialog isShown={isApproveShown} setIsShown={setIsInfoShown} goodInfo={currentGood} onRefresh={loadHistory} />
            <PublishToMarketDialog isShown={isPublishToMarket} setIsShown={setIsPublishToMarket} goodInfo={currentGood} onRefresh={loadHistory} />
        </Pane>
    </main>
}

export default History;
