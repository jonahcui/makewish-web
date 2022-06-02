import type {NextPage} from 'next'
import styles from '../../styles/goods/GoodsDetail.module.scss'
import {Badge, Button, LinkIcon, Pane, Table, TextInput, toaster, Text, majorScale} from "evergreen-ui";
import React, {useEffect, useState} from "react";
import LogoDivider from "../../components/LogoDivider";
import classNames from "classnames";
import {
    getGoodInfo,
    getUserRecords,
    getUserTickets,
    GoodInfo,
    UserGoodRecord
} from "../../feature/goods/goodsAPI";
import {useRouter} from "next/router";
import {useAppSelector} from "../../app/hooks";
import {selectIsOwner, selectWallet} from "../../feature/wallet/walletSlice";
import {getUserBalance} from "../../feature/token/tokenAPI";
import BigNumber from "bignumber.js";
import {getGoodStatus, GoodStatus} from "../../utils/StatusUtils";
import {formatNumber, formatTime} from "../../utils/time";
import {exchangeAndPurchase, pickWinner} from "../../feature/comptroller/comptrollerAPI";
import Countdown from "react-countdown";
import _ from 'lodash';
import {openAddress, openBlock} from "../../utils/explore";
import {openIPFSImage} from "../../utils/Web3Request";
import {right} from "glamor";

// @ts-ignore
const UserRow =({record, winner}) => {
    if (!record) {
        return <React.Fragment />;
    }
    return <Table.Row className={styles.rankTableHead} style={{backgroundColor: "black"}}>
        <Table.TextCell className={styles.dataCell} flexBasis={100}>{record.userName && record.userName !== '' ? record.userName : record?.user.substring(2, 8)}</Table.TextCell>
        <Table.TextCell className={styles.dataCell} flexBasis={100}>{record?.count}</Table.TextCell>
        <Table.TextCell className={styles.dataCell} flexBasis={500} style={{cursor: "pointer"}} onClick={() => openAddress(record?.user)}>
            <Text size={400} color={"#F1F1F1"}>
                {record?.user}
            </Text>
        </Table.TextCell>
        <Table.TextCell className={styles.dataCell} flexBasis={300}>{formatTime(record?.joinTime)}</Table.TextCell>
        <Table.TextCell className={styles.dataCell} flexBasis={200} style={{cursor: "pointer"}} onClick={() => openBlock(record?.joinBlockNum)}>{record?.joinBlockNum}</Table.TextCell>
        <Table.TextCell className={styles.dataCell} flexBasis={80} onClick={() => openBlock(record?.joinBlockNum)}>
            {record.user === winner ? <Badge color="yellow">WIN</Badge> : <div />}
        </Table.TextCell>
    </Table.Row>
}

const GoodStatusTag = ({goodStatus, goodInfo, isOwner, onPickWinner} : {goodStatus: GoodStatus, goodInfo?: GoodInfo, isOwner: boolean, onPickWinner: Function}) => {
    if (goodStatus == GoodStatus.NON_GOOD) {
        return <div>{" "}</div>
    }

    if (goodStatus == GoodStatus.UN_START) {
        return <div className={classNames(styles.stateText, styles.greyColor)}>未开始</div>
    }

    if (goodStatus == GoodStatus.SUCCESS) {
        return <div className={classNames(styles.stateText, styles.greyColor)}>已开奖</div>
    }

    if (goodStatus == GoodStatus.LOCKED) {
        // @ts-ignore
        return <div>
            <div className={classNames(styles.stateText)}>等待开奖结果</div>
            <div className={classNames(styles.stateText)}>
                <Countdown date={parseInt(goodInfo?.lockedTime as string)  * 1000 + 5 * 60 * 1000} className={styles.stateText} />
            </div>
            {<Button intent="danger" style={{width: "100%"}} onClick={(e:any) => onPickWinner()}>开奖</Button>}
            {<Text color="#FFFFFF" marginTop={majorScale(1)}>开奖可以获得手续费奖励</Text>}
        </div>
    }

    if (goodStatus == GoodStatus.IN_PROGRESS) {
        return <div>
            <div className={classNames(styles.stateText)}>进行中</div>
            <div className={classNames(styles.stateText)}>
                <Countdown date={parseInt(goodInfo?.lockedTime as string)  * 1000} className={styles.stateText} />
            </div>
        </div>
    }

    return <div>{" "}</div>
}

const getOffset = (page: number, pageSize: number, totalRecords: number) => {
    return totalRecords - 1 - (page - 1) * pageSize;
}

// @ts-ignore
const getTicket =(id, index) => {
    return id + ("0000000000" + index).slice(-10)
}

const getNeedEth = (balance: BigNumber, count: string) => {
    const decimal = new BigNumber(10).exponentiatedBy(18);
    const needWishToken  = new BigNumber(count).times(decimal).minus(balance.times(decimal))
    if (needWishToken.lt(new BigNumber(0))) {
        return "0"
    }
    return needWishToken.div(decimal).toFormat(18)
}

const getNeedWei = (balance: BigNumber, count: string): BigNumber => {
    const decimal = new BigNumber(10).exponentiatedBy(18);
    const needWei = new BigNumber(count).times(decimal).minus(balance.times(decimal))
    if (needWei.lt(new BigNumber(0))) {
        return new BigNumber(0)
    }
    return needWei;
}

const Detail: NextPage = () => {
    const router = useRouter()
    const {id} = router.query
    const wallet = useAppSelector(selectWallet);
    const isOwner = useAppSelector(selectIsOwner)

    const [goodInfo, setGoodInfo] = useState<GoodInfo>();
    const [loadding, setLoadding] = useState<boolean>(false);

    const [count, setCount] = useState('1');
    const [goodStatus, setGoodStatus] = useState<GoodStatus>(GoodStatus.NON_GOOD);

    const [userRecords, setUserRecords] = useState<Array<UserGoodRecord>>([]);
    const [userTickets, setUserTickets] = useState<Array<number>>([]);
    const [userBalance, setUserBalance] = useState<BigNumber>(new BigNumber(0));

    const loadGoodInfo = async () => {
        setLoadding(true)
        if (!id) {
            return;
        }
        const good = await getGoodInfo(parseInt(id as string));
        console.log("1111", good)
        setLoadding(false)
        if (good != null) {
            setGoodInfo(good)
            setGoodStatus(getGoodStatus(good));
        }

        await _loadUsers(good, {
            pageSize: 20,
            current: 1,
            totalPages: good.joinedUsers % 20 > 0 ? good.joinedUsers / 20 + 1 : good.joinedUsers
        });

        await _loadTickets();
    }

    const _loadUsers = async (goodInfo: GoodInfo, page: any) => {
        const totalRecords = goodInfo?.joinedUsers;
        if (!totalRecords || totalRecords == 0) {
            return;
        }
        const result = await getUserRecords(id as string);
        setUserRecords(result)
    }

    const _loadTickets = async () => {
        if (!wallet.account) {
            return;
        }
        // @ts-ignore
        const userHistories = await getUserTickets(id, wallet.account);
        const userBalance = await getUserBalance(wallet.account);
        console.log(userBalance)
        setUserTickets(userHistories);
        setUserBalance(new BigNumber(userBalance).div(new BigNumber(10).exponentiatedBy(18)));
    }



    useEffect(() => {
        loadGoodInfo()
    }, [router, id]);


    const onMaxCount = () => {
        setCount('100')
    }

    // @ts-ignore
    const onCountChange = (e) => {
        if (!_.isInteger(_.toNumber(e.target.value))) {
            toaster.danger("请输入有效数字，必须是整数")
            setCount('1')
        } else if (e.target.value.indexOf(".") > -1) {
            toaster.danger("请输入有效数字，必须是整数")
            setCount('1')
        } else {
            setCount(e.target.value)
        }
    }

    const purchase = async () => {
        if (!wallet.account || !goodInfo?.goodId || !count) {
            toaster.danger("请连接钱包后购买");
            return;
        }
        const wei = getNeedWei(userBalance, count);
        console.log("购买：", [wallet.account, goodInfo?.goodId, count.toString(), wei.toString(),])
        try {
            const resp = await exchangeAndPurchase(wallet.account, goodInfo?.goodId, new BigNumber(count), wei);
            console.log("购买成功：", resp.txHash)
            toaster.success('商品购买成功: txHash为: ' + resp.transactionHash)
            loadGoodInfo()
        } catch (e) {
            console.error("购买失败：", e)
            toaster.danger("购买失败");
        }

    }

    const onPickWinner = async () => {
        console.log("开奖：", [goodInfo?.goodId])
        const resp = await pickWinner(parseInt(id as string), wallet.account as string);
        console.log("开奖：", resp?.txHash)
        loadGoodInfo();
    }

    return <div>
        <main className={styles.main}>
            <Pane display={"flex"} alignItems="center" flexDirection="column">
                <Pane display={"flex"} justifyContent={"center"} marginTop={50}>
                    <Pane style={{marginRight: 20}}>
                        {goodInfo && <Pane is="img" style={{width: 282, height: 282}} src={openIPFSImage(goodInfo.fileHash)} /> }
                        <GoodStatusTag goodStatus={goodStatus} goodInfo={goodInfo} isOwner={isOwner} onPickWinner={onPickWinner} />
                    </Pane>
                    <Pane marginBottom={50} width={500}>
                        <div className={styles.text26} style={{marginBottom: 8}}>
                            {goodInfo?.isNft && <Badge color="purple">NFT</Badge>}
                            {goodInfo?.goodName}
                        </div>
                        <div className={styles.text18} style={{marginBottom: 8}}>ID: {goodInfo?.goodId}</div>
                        <div className={styles.text18} style={{marginBottom: 8}}>NFT Token: {goodInfo?.nftTokenContractAddress}</div>
                        <div className={styles.text18} style={{marginBottom: 8}}>Token Id: <a href={goodInfo?.tokenURL} style={{color: "#85A3FF"}}>
                            {goodInfo?.tokenId}
                        </a> </div>
                        <div className={classNames(styles.text18, styles.borderBottom)} style={{marginBottom: 8}}>市场价值: {goodInfo?.goodValue} WISH, 手续费: {goodInfo?.maintenanceFee} WISH</div>
                        <div className={styles.text22} style={{marginBottom: 16}}>
                            <span style={{marginRight: 20}}>
                            份额单价: 1 WISH
                            </span>
                            <span>
                            已参与人数/总购买份数: {goodInfo?.joinedUsers} / {goodInfo?.ticketCounts}
                            </span>
                        </div>
                        {/*开奖后展示*/}
                        {goodStatus === GoodStatus.SUCCESS && <Pane paddingX={46} paddingY={17} paddingBottom={30} background={"#292929"}>
                            <div className={styles.text16} style={{marginBottom: 4}} onClick={() => openAddress(goodInfo?.winner as string)}>
                                大赢家: {goodInfo?.winner}  <LinkIcon style={{paddingTop: 4.5}} />
                            </div>
                            <div className={styles.text16} style={{marginBottom: 4}}>
                                奖金: {goodInfo?.goodValue} WISH
                            </div>
                            <div className={styles.text16} style={{marginBottom: 4}}>
                                手续费: {goodInfo?.maintenanceFee}
                            </div>
                            <div className={styles.text16} style={{marginBottom: 4}}>
                                返还金额（每票）: {formatNumber(goodInfo?.paybackFee)}
                            </div>
                            <div className={styles.text16} style={{marginBottom: 4}} onClick={() => openBlock(goodInfo?.winnerBlock)}>
                                开奖时间(开奖block): {formatTime(goodInfo?.winnerTime)}  ({goodInfo?.winnerBlock})  <LinkIcon style={{paddingTop: 4.5}} />
                            </div>
                        </Pane>}
                        {goodStatus !== GoodStatus.SUCCESS && <Pane paddingX={46} paddingY={17} paddingBottom={30} background={"#292929"}>
                            <div className={styles.text16} style={{marginBottom: 4}}>
                                填写你的认购份额
                            </div>
                            <div className={styles.text22} style={{marginBottom: 8}}>
                                <TextInput value={count} onChange={onCountChange}  />
                                <span className={styles.primaryColor} style={{marginLeft: 10}} onClick={onMaxCount}>
                                MAX
                                </span>
                            </div>
                            <div className={styles.text16} style={{marginBottom: 4}}>当前余额为: <span className={ styles.primaryColor}>
                                {userBalance.toFormat(18) + ''} WISH
                            </span> </div>
                            <div className={styles.text16} style={{marginBottom: 4}}>认购花费金额</div>
                            <div>
                                <span
                                    className={classNames(styles.text22, styles.primaryColor)}>{getNeedEth(userBalance, count)}</span>
                                <span className={styles.text18}>{' '}ETH {' '}</span>
                            </div>
                            {goodStatus == GoodStatus.IN_PROGRESS ?
                                <div className={classNames(styles.text26, styles.purchaseBtn)} onClick={purchase}>
                                    <i>MAKEWISH</i>
                                </div>
                                : <div className={classNames(styles.text26, styles.purchaseBtnDisabled)}><i>MAKEWISH</i></div>
                            }
                        </Pane>}
                        <div className={classNames(styles.text18)} style={{marginBottom: 4, marginTop: 4}}>
                            <i>
                                每次成功参与，都将获得对应WISH代币奖励
                            </i>
                        </div>
                        {wallet.account && userTickets.length > 0 && <Pane paddingX={46} paddingY={17} paddingBottom={30} background={"#292929"}>
                            <div className={styles.text16}>已拥有抽奖码 {userTickets.length > 100 ? '(只展示前100)' : ''}</div>
                            <Pane display={"flex"} flexWrap={"wrap"} gap={8}>
                                {userTickets.slice(0, 100).map(ticket => <div key={ticket} className={styles.text14}>{getTicket(goodInfo?.goodId, ticket)}</div>)}
                            </Pane>
                        </Pane>}
                    </Pane>
                </Pane>
                {/*  divider  */}
                <LogoDivider />
                {/* join record */}
                <Pane marginBottom={135} width={1200}>
                    <div className={styles.text26} style={{textAlign: "center", marginBottom: 10, marginTop: 30}}>本商品认购参与记录</div>
                    <Table.Body style={{backgroundColor: "black"}}>
                        <Table.Head style={{backgroundColor: "black"}}>
                            <Table.TextCell className={styles.headCell} flexBasis={100}>昵称</Table.TextCell>
                            <Table.TextCell className={styles.headCell} flexBasis={100}>认购份额</Table.TextCell>
                            <Table.TextCell className={styles.headCell} flexBasis={500}  flexShrink={0} flexGrow={0}>账户地址</Table.TextCell>
                            <Table.TextCell className={styles.headCell} flexBasis={300}>认购时间</Table.TextCell>
                            <Table.TextCell className={styles.headCell} flexBasis={200}>交易block</Table.TextCell>
                            <Table.TextCell className={styles.headCell} flexBasis={50}>{' '}</Table.TextCell>
                        </Table.Head>
                        <Table.Body style={{backgroundColor: "black"}}>
                            {/*{goodInfo && renderTableRows()}*/}
                            {userRecords.map(userRecord => <UserRow key={userRecord.user} record={userRecord} winner={goodInfo?.winner} />)}
                        </Table.Body>
                    </Table.Body>
                </Pane>
            </Pane>
        </main>
    </div>
}

export default Detail;
