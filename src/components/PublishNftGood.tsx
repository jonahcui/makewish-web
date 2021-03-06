import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    FileCard,
    FileUploader,
    Link as EvergreenLink,
    majorScale,
    Pane,
    TextInputField,
    toaster
} from "evergreen-ui";
import {create, IPFSHTTPClient} from "ipfs-http-client";
import {useAppSelector} from "../app/hooks";
import {selectIsOwner, selectWallet} from "../feature/wallet/walletSlice";
import Web3 from "web3";
import {AbiItem} from "web3-utils";
import GoodLotteryNFT from "../contracts/GoodLotteryNFT.json"


const PublishNftGood: React.FC<{onCreateSuccess?: Function}> = ({onCreateSuccess}) => {
    const wallet = useAppSelector(selectWallet);
    const isOwner = useAppSelector(selectIsOwner);
    const [isShown, setIsShown] = useState(false);
    const [ipfs, setIpfs] = useState<IPFSHTTPClient | undefined>();

    const [goodName, setGoodName] = useState('');
    const [goodId, setGoodId] = useState<number>(1);
    const [goodValue, setGoodValue] = useState(100);
    const [goodInfo, setGoodInfo] = useState('');
    const [maintenanceFee, setMaintenanceFee] = useState(2);
    const [publishTime, setPublishTime] = useState(0);
    const [lockedTime, setLockedTime] = useState(30);
    const [nftTokenContractAddress, setNftTokenContractAddress] = useState(process.env.NEXT_PUBLIC_CONTRACT_NFT);
    const [tokenId, setTokenId] = useState();
    const [tokenURL, setTokenURL] = useState();

    // image
    const [fileHash, setFileHash,] = useState<string>('');
    const [files, setFiles] = React.useState<Array<File>>([])
    const [fileRejections, setFileRejections] = React.useState([])

    const onGoodNameChange = React.useCallback((name: string) => {
        setGoodName(name);
    }, [])
    const onGoodIdChange = React.useCallback((goodId: number) => {
        setGoodId(goodId);
    }, [])

    const onGoodValueChange = React.useCallback((goodValue: number) => {
        setGoodValue(goodValue);
    }, [])

    const onGoodInfoChange = React.useCallback((goodInfo: string) => {
        setGoodInfo(goodInfo);
    }, [])

    const onMaintenanceChange = React.useCallback((maintenanceFee: number) => {
        setMaintenanceFee(maintenanceFee)
    }, [])

    const onLockedTimeChange = React.useCallback((lockedTime: number) => {
        setLockedTime(lockedTime)
    }, [])

    const onPublishTimeChange = React.useCallback((publishTime: number) => {
        setPublishTime(publishTime)
    }, [])

    const handleFileChange = React.useCallback(async (files: File[]) => {
        setFiles([files[0]]);
        const result = await (ipfs as IPFSHTTPClient).add(files[0]);
        setFileHash(result.path)
    }, [ipfs])
    // @ts-ignore
    const handleFileRejected = React.useCallback((fileRejections: any) => setFileRejections([fileRejections[0]]), [])
    const handleFileRemove = React.useCallback(() => {
        setFiles([])
        setFileRejections([])
    }, [])

    const onSubmit = React.useCallback(async () => {
        if (goodName === '' || goodId < 1 || goodValue < 1 || maintenanceFee < 0 || fileHash === '') {
            toaster.danger('请将信息补充完整');
            return;
        }

        if (nftTokenContractAddress === '' || tokenId === '' || tokenURL === '') {
            toaster.danger('请将NFT信息补充完整');
            return;
        }

        if (!wallet.account) {
            toaster.danger('请先登陆');
            return;
        }
        const good = {
            goodName, goodId, goodValue, maintenanceFee, goodInfo, fileHash, nftTokenContractAddress,
            tokenId, tokenURL, isNft: true
        };
        const result = await (ipfs as IPFSHTTPClient).add(JSON.stringify(good));
        toaster.notify('商品信息上传到IPFS成功，文件hash为：' + result.path)

        const web3 = new Web3(window.ethereum);
        const instance = new web3.eth.Contract(GoodLotteryNFT.abi as AbiItem[]);
        const params = [
            process.env.NEXT_PUBLIC_CONTRACT_MAIN,
            process.env.NEXT_PUBLIC_CONTRACT_TOKEN,
            parseInt(String(goodId)),
            parseInt(String(goodValue)),
            parseInt(String(maintenanceFee)),
            publishTime * 60 + parseInt(new Date().getTime()/ 1000 + ''),
            lockedTime * 60 + parseInt(new Date().getTime()/ 1000 + ''),
            result.path,
            nftTokenContractAddress,
            tokenId,
            wallet.account
        ]
        const r = instance.deploy({data: GoodLotteryNFT.bytecode, arguments: params})

        let response;
        try {
            response = await r.send({
                from: wallet.account,
                gas: 6712388,
                gasPrice: '20000000000',
            })
            setIsShown(false);
            if (onCreateSuccess) {
                onCreateSuccess();
            }
            console.log("部署商品合约成功: ", params, response)
            toaster.notify("合约创建成功，发布商品中")
        } catch (e) {
            console.log(e)
            toaster.danger("合约创建失败")
            return;
        }
    },[goodName, goodId, goodValue, maintenanceFee, goodInfo, fileHash, wallet, tokenId, tokenURL, nftTokenContractAddress])

    useEffect(() => {
        let ipfs: IPFSHTTPClient | undefined;
        try {
            ipfs = create({
                url: process.env.NEXT_PUBLIC_IPFS_API,

            });
            setIpfs(ipfs)
        } catch (error) {
            console.error("IPFS error ", error);
            setIpfs(undefined)
        }
    }, []);

    return <Pane>
        <Dialog
            isShown={isShown}
            title="发布商品"
            minHeightContent={"80%"}
            onConfirm={onSubmit}
            onCloseComplete={() => setIsShown(false)}
            confirmLabel="提交"
            cancelLabel="取消"
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEscapePress={false}
            preventBodyScrolling
        >
            <TextInputField
                required={true}
                label="商品Id"
                hint="商品Id只能是数字"
                placeholder="请输入商品Id"
                value={goodId}
                onChange={(e: any) => onGoodIdChange(e.target.value)}
            />
            <TextInputField
                required={true}
                label="商品名称"
                placeholder="请输入商品名称"
                value={goodName}
                onChange={(e: any) => onGoodNameChange(e.target.value)}
            />
            <TextInputField
                required={true}
                label="商品简介"
                placeholder="请输入商品简介"
                value={goodInfo}
                onChange={(e: any) => onGoodInfoChange(e.target.value)}
            />
            <TextInputField
                required={true}
                label="商品价值"
                hint="商品价值只能是数字"
                placeholder="请输入商品价值"
                value={goodValue}
                onChange={(e: any) => onGoodValueChange(e.target.value)}
            />
            <TextInputField
                required={true}
                label="维护费用"
                hint="维护费用, 用来给owner提供gas"
                placeholder="请输入商品维护费用"
                value={maintenanceFee}
                onChange={(e: any) => onMaintenanceChange(e.target.value)}
            />
            <TextInputField
                required={true}
                label="NFT Token 合约地址"
                hint="符合ERC721标准的合约地址"
                placeholder="请输入Token地址"
                value={nftTokenContractAddress}
                onChange={(e: any) => setNftTokenContractAddress(e.target.value)}
            />
            <TextInputField
                required={true}
                label="NFT Token Id"
                hint="Token Id"
                placeholder="请输入TokenId"
                value={tokenId}
                onChange={(e: any) => setTokenId(e.target.value)}
            />
            <TextInputField
                required={true}
                label="NFT Token URL"
                hint="Token URL"
                placeholder="请输入详细信息URL"
                value={tokenURL}
                onChange={(e: any) => setTokenURL(e.target.value)}
            />
            <TextInputField
                required={true}
                label="延迟生效时间"
                hint="从创建商品开始，延迟多长时间发布，单位：分钟"
                placeholder="请输入延迟生效时间"
                value={publishTime}
                onChange={(e: any) => onPublishTimeChange(e.target.value)}
            />
            <TextInputField
                required={true}
                label="延迟锁定时间"
                hint="从创建商品开始，延迟多长时间锁定，单位：分钟"
                placeholder="请输入延迟锁定"
                value={lockedTime}
                onChange={(e: any) => onLockedTimeChange(e.target.value)}
            />

            <FileUploader
                label="上传商品图片"
                description={"1MB以内，1个文件, 文件hash为：" + fileHash}
                maxSizeInBytes={1 * 1024 ** 2}
                maxFiles={1}
                onChange={handleFileChange}
                onRejected={handleFileRejected}
                renderFile={(file) => {
                    const { name, size, type } = file
                    //@ts-ignore
                    const fileRejection = fileRejections.find((fileRejection) => fileRejection.file === file)
                    //@ts-ignore
                    const { message } = fileRejection || {}
                    return (
                        <FileCard
                            key={name}
                            isInvalid={fileRejection != null}
                            name={name}
                            onRemove={handleFileRemove}
                            sizeInBytes={size}
                            type={type}
                            validationMessage={message}
                        />
                    )
                }}
                values={files}
            />
        </Dialog>
        {
            <Button marginRight={16} size="small" intent="none" appearance="primary" onClick={() => setIsShown(true)}>
                发布新商品
            </Button>
        }

    </Pane>
}

export default PublishNftGood;
