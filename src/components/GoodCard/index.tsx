import {Badge, Button, Card, majorScale, Pane, Spinner} from "evergreen-ui";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import styles from "./GoodCard.module.scss"
import {openIPFSImage} from "../../utils/Web3Request";
import Web3 from "web3";
import {getGoodInfo, GoodInfo} from "../../feature/goods/goodsAPI";
import {getGoodStatus, GoodStatus} from "../../utils/StatusUtils";

interface Props {
    web3: Web3
    index: number
    contract: any
}

const GoodCard = ({web3, index} : Props) => {
    const [goodInfo, setGoodInfo] = useState<GoodInfo>();
    const [loadding, setLoadding] = useState<boolean>(false);

    const loadGoodInfo = async () => {
        setLoadding(true)
        const good = await getGoodInfo(index);
        if (good != null) {
            setGoodInfo(good)
        }
        setLoadding(false)
    }

    useEffect(() => {
        loadGoodInfo()
    }, [web3]);

    const _getTag = () => {
        if (!goodInfo) {
            return <div />
        }
        const status = getGoodStatus(goodInfo);
        if (status === GoodStatus.SUCCESS) {
            return <Badge color="neutral" className={styles.statusTag}>已开奖</Badge>
        }
        if (status === GoodStatus.LOCKED ) {
            return <Badge color="red" className={styles.statusTag}>已锁定</Badge>
        }
        if (status === GoodStatus.UN_START) {
            return <Badge color="teal" className={styles.statusTag}>未开始</Badge>
        }
        return <Badge color="green" className={styles.statusTag}>进行中</Badge>
    }

    if (!goodInfo) {
        return <div />
    }
    if (loadding) {
        return <Spinner className={styles.card}/>
    }
    return <Card className={styles.card} style={{marginRight: majorScale(2)}}>
        {_getTag()}
        <Pane is={"img"} src={openIPFSImage(goodInfo?.fileHash)} width={255} height={255} />
        <div className={styles.goodName}>{goodInfo?.goodId} -- {goodInfo?.goodName}</div>
        <div className={styles.goodId}>{goodInfo?.goodInfo}</div>
        <div className={styles.divider}></div>
        <Pane display="flex" justifyContent="space-between" alignItems={"center"}>
            <Pane>
                <div className={styles.goodInfo}>商品价值: {goodInfo?.goodValue} </div>
                <div className={styles.goodInfo}>已购买: {goodInfo?.joinedUsers} </div>
            </Pane>
            <Link href={`/goods/${index}`} passHref>
                <Button appearance={"primary"} >
                    GO
                </Button>
            </Link>
        </Pane>
    </Card>;
}

export default GoodCard;
