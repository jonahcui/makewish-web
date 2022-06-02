import {Dialog, Image, majorScale, Pane, Paragraph, Text} from 'evergreen-ui';
import React from 'react';
import {NftGoodHistory} from "../feature/goods/goodsAPI";
import {openIPFSImage} from "../utils/Web3Request";
import {formatTime} from "../utils/time";

interface Props {
    goodInfo: NftGoodHistory | null
    isShown: boolean
    setIsShown: Function
}

const NftGoodInfo : React.FC<Props> = ({goodInfo, isShown, setIsShown}) => {

    return <Pane>
        <Dialog
            isShown={isShown}
            title={`商品信息-${goodInfo? goodInfo.goodId: ''}-${goodInfo? goodInfo.goodName: ''}`}
            onCloseComplete={() => setIsShown(false)}
            onConfirm={() => setIsShown(false)}
            confirmLabel="确认"
            width={700}
        >
            {goodInfo && <Pane display={"flex"} justifyContent={"space-between"}>
                {goodInfo && <Pane is="img" style={{width: 250, height: 250}} src={openIPFSImage(goodInfo.fileHash)} /> }
                <Pane marginLeft={majorScale(2)}>
                    <Paragraph size={500} marginTop={12} >
                        商品介绍：{goodInfo.goodInfo}
                    </Paragraph>
                    <Paragraph size={500} marginTop={12} >
                        NFT合约地址：{goodInfo.nftAddress}
                    </Paragraph>
                    <Paragraph size={500} marginTop={12} >
                        NFT Token Id：<a href={goodInfo.tokenURL}>{goodInfo.tokenId} </a>
                    </Paragraph>
                    <Paragraph size={500} marginTop={12} >
                        商品价值：{goodInfo?.goodValue}
                    </Paragraph>
                    <Paragraph size={500} marginTop={12} >
                        手续费：{goodInfo?.maintenanceFee}
                    </Paragraph>
                    <Paragraph size={500} marginTop={12} >
                        开始时间：{formatTime(parseInt(goodInfo?.publishTime + ''))}
                    </Paragraph>
                    <Paragraph size={500} marginTop={12} >
                        锁定时间：{formatTime(parseInt(goodInfo?.lockedTime))}
                    </Paragraph>
                    <Paragraph size={500} marginTop={12} >
                        可以开奖时间：{formatTime(parseInt(goodInfo?.lockedTime) + 5 * 60)}
                    </Paragraph>
                </Pane>
            </Pane>}

        </Dialog>

    </Pane>
}


export default NftGoodInfo
