import React, {useEffect, useState} from 'react';
import {
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
import {useAppSelector} from "../../app/hooks";
import {selectIsOwner, selectWallet} from "../../feature/wallet/walletSlice";
import Web3 from "web3";
import {AbiItem} from "web3-utils";
import GoodLottery from "../../contracts/GoodLottery.json"
import Comptroller from "../../contracts/Comptroller.json"
import {deployComptroller, deployWishApi} from "../../utils/Web3Request";


const PublishGood: React.FC<{}> = () => {
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
        if (goodName === '' || goodId < 1 || goodValue < 1 || goodValue > 1000 || maintenanceFee < 0 || fileHash === '') {
            toaster.danger('????????????????????????');
            return;
        }
        if (!wallet.account) {
            toaster.danger('????????????');
            return;
        }
        const good = {
            goodName, goodId, goodValue, maintenanceFee, goodInfo, fileHash
        };
        const result = await (ipfs as IPFSHTTPClient).add(JSON.stringify(good));
        toaster.notify('?????????????????????IPFS???????????????hash??????' + result.path)

        const web3 = new Web3(window.ethereum);
        const instance = new web3.eth.Contract(GoodLottery.abi as AbiItem[]);
        const params = [
            process.env.NEXT_PUBLIC_CONTRACT_MAIN,
            process.env.NEXT_PUBLIC_CONTRACT_TOKEN,
            parseInt(String(goodId)),
            parseInt(String(goodValue)),
            parseInt(String(maintenanceFee)),
            publishTime * 60 + parseInt(new Date().getTime()/ 1000 + ''),
            lockedTime * 60 + parseInt(new Date().getTime()/ 1000 + ''),
            result.path
        ]
        const r = instance.deploy({data: GoodLottery.bytecode, arguments: params})

        let response;
        try {
            response = await r.send({
                from: wallet.account,
                gas: 4712388,
                gasPrice: '20000000000',
            })
            console.log("????????????????????????: ", params, response)
            toaster.notify("????????????????????????????????????")
        } catch (e) {
            console.log(e)
            toaster.danger("??????????????????")
            return;
        }
        const mainContract = new web3.eth.Contract(Comptroller.abi as AbiItem[], process.env.NEXT_PUBLIC_CONTRACT_MAIN)
        const publishResult = await mainContract.methods.publishGood([response.options.address])
            .send({from: wallet.account, gas: 4712388, gasPrice: '20000000000',});
        console.log("?????????????????????", publishResult.transactionHash);
        toaster.success('?????????????????????????????????' + response.options.address + ", txHash???" + publishResult.transactionHash)

    },[goodName, goodId, goodValue, maintenanceFee, goodInfo, fileHash, wallet])

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
            title="????????????"
            minHeightContent={"80%"}
            onConfirm={onSubmit}
            onCloseComplete={() => setIsShown(false)}
            confirmLabel="??????"
            cancelLabel="??????"
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEscapePress={false}
            preventBodyScrolling
        >
            <TextInputField
                required={true}
                label="??????Id"
                hint="??????Id???????????????"
                placeholder="???????????????Id"
                value={goodId}
                onChange={(e: any) => onGoodIdChange(e.target.value)}
            />
            <TextInputField
                required={true}
                label="????????????"
                placeholder="?????????????????????"
                value={goodName}
                onChange={(e: any) => onGoodNameChange(e.target.value)}
            />
            <TextInputField
                required={true}
                label="????????????"
                placeholder="?????????????????????"
                value={goodInfo}
                onChange={(e: any) => onGoodInfoChange(e.target.value)}
            />
            <TextInputField
                required={true}
                label="????????????"
                hint="???????????????????????????"
                placeholder="?????????????????????"
                value={goodValue}
                onChange={(e: any) => onGoodValueChange(e.target.value)}
            />
            <TextInputField
                required={true}
                label="????????????"
                hint="????????????, ?????????owner??????gas"
                placeholder="???????????????????????????"
                value={maintenanceFee}
                onChange={(e: any) => onMaintenanceChange(e.target.value)}
            />
            <TextInputField
                required={true}
                label="??????????????????"
                hint="??????????????????????????????????????????????????????????????????"
                placeholder="???????????????????????????"
                value={publishTime}
                onChange={(e: any) => onPublishTimeChange(e.target.value)}
            />
            <TextInputField
                required={true}
                label="??????????????????"
                hint="??????????????????????????????????????????????????????????????????"
                placeholder="?????????????????????"
                value={lockedTime}
                onChange={(e: any) => onLockedTimeChange(e.target.value)}
            />

            <FileUploader
                label="??????????????????"
                description={"1MB?????????1?????????, ??????hash??????" + fileHash}
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
        {wallet.account === process.env.NEXT_PUBLIC_OWNER_ADDRESS && <Pane>
            <EvergreenLink color={undefined} marginRight={majorScale(3)} onClick={() => setIsShown(true)}>
                ????????????
            </EvergreenLink>
        </Pane>}

    </Pane>
}

export default PublishGood;
