import {Badge, Button, Card, majorScale, Pane, Paragraph, Spinner, Text} from "evergreen-ui";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import styles from "./GoodCard.module.scss"
import {openIPFSImage} from "../../utils/Web3Request";
import Web3 from "web3";
import {getGoodInfo, GoodInfo} from "../../feature/goods/goodsAPI";
import {getGoodStatus, GoodStatus} from "../../utils/StatusUtils";
import {formatTime} from "../../utils/time";

interface Props {
    good: GoodInfo
}

const GoodCard = ({good: goodInfo} : Props) => {

    const _getTag = () => {
        if (!goodInfo) {
            return <div />
        }
        const status = getGoodStatus(goodInfo);
        if (status === GoodStatus.SUCCESS) {
            return <Badge size={700} color="neutral" className={styles.statusTag}>已开奖</Badge>
        }
        if (status === GoodStatus.LOCKED ) {
            return <Badge size={700} color="red" className={styles.statusTag}>已锁定</Badge>
        }
        if (status === GoodStatus.UN_START) {
            return <Badge size={700} color="teal" className={styles.statusTag}>未开始</Badge>
        }
        return <Badge size={700} color="green" className={styles.statusTag}>进行中</Badge>
    }

    if (!goodInfo) {
        return <div />
    }
    return <Card className={styles.card} style={{marginRight: majorScale(2), marginTop: majorScale(2)}}>
        { goodInfo?.isNft && <Badge color="purple" style={{float: 'left'}}>NFT</Badge>}
        {_getTag()}
        <Pane is={"img"} src={openIPFSImage(goodInfo?.fileHash)} width={255} height={255} />
        <div className={styles.goodName}>{goodInfo?.goodId} -- {goodInfo?.goodName}</div>
        <Paragraph className={styles.goodId} color={"#F1F1F1"}>
            {goodInfo?.goodInfo}
        </Paragraph>
        <div className={styles.goodId}></div>
        <div className={styles.divider}></div>
        <Pane display="flex" justifyContent="space-between" alignItems={"center"}>
            <Pane>
                <div className={styles.goodInfo}>
                    <Text size={500} color={"#F1F1F1"}>
                        商品价值: {goodInfo?.goodValue}
                    </Text>
                </div>
                <div className={styles.goodInfo}>
                    <Text size={500} color={"#F1F1F1"}>
                    已购买: {goodInfo?.joinedUsers}
                    </Text>
                </div>
                <div className={styles.goodInfo}>
                    <Text size={300} color={"#F1F1F1"}>
                    开始时间: {formatTime(parseInt(goodInfo?.publishTime + '') + 60)}
                    </Text>
                </div>
                <div className={styles.goodInfo}>
                    <Text size={300} color={"#F1F1F1"}>
                    锁定时间: {formatTime(parseInt(goodInfo?.lockedTime))}
                    </Text>
                </div>
            </Pane>
            <Link href={`/goods/${goodInfo.goodIndex}`} passHref>
                <Button appearance={"primary"} >
                    GO
                </Button>
            </Link>
        </Pane>
    </Card>;
}

export default GoodCard;
