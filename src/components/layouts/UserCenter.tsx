import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    Heading,
    Link as EvergreenLink,
    majorScale,
    Pane,
    Paragraph,
    SideSheet,
    Tab, Tablist,
    Text,
    Table
} from "evergreen-ui";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import {Pie} from 'react-chartjs-2';
import BigNumber from "bignumber.js";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectWallet, setAccount, setUserName} from "../../feature/wallet/walletSlice";
import {getTotalSupply, getUserBalance, getUserTransferHistories, TransferHistory} from "../../feature/token/tokenAPI";
import Web3 from "web3";
import ChangeUserName from "../ChangeUserName";
import {getUserName} from "../../feature/comptroller/comptrollerAPI";
import Withdraw from "../Withdraw";
import {formatNumber} from "../../utils/time";

ChartJS.register(ArcElement, Tooltip, Legend);
const decimal = new BigNumber(10).exponentiatedBy(new BigNumber(18));
export const getData = (ethBalance: number, wishSupply: number) => ({
    labels: ['Eth', 'WISH'],
    datasets: [
        {
            label: '资产池',
            data: [ethBalance, wishSupply],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
        },
    ],
});


const UserCenter = () => {
    const dispatch = useAppDispatch();
    const wallet = useAppSelector(selectWallet);

    const [isShown, setIsShown] = useState(false);
    const [userBalance, setUserBalance] = useState(new BigNumber(0));
    const [userEth, setUserEth] = useState(new BigNumber(0));
    const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
    const [contractEth, setContractEth] = useState(new BigNumber(0));
    const [exchangeRate, setExchangeRate] = useState(new BigNumber(1))
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [transferHistories, setTransferHistories] = useState<Array<TransferHistory>>([]);

    const loadBalance = async () => {
       const totalSupply = await getTotalSupply();
       setTotalSupply(new BigNumber(totalSupply));
        const provider = new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_ETH_RPC_URL as string);
        const web3 = new Web3(provider);
        const contractBalance = await web3.eth.getBalance(process.env.NEXT_PUBLIC_CONTRACT_MAIN as string);

        setContractEth(new BigNumber(contractBalance));
        setExchangeRate(new BigNumber(contractBalance).div(new BigNumber(totalSupply)));

        if (wallet.account) {
            const userEth = await web3.eth.getBalance(wallet.account);
            setUserEth(new BigNumber(userEth));

            const userBalance = await getUserBalance(wallet.account);
            setUserBalance(new BigNumber(userBalance))

            const userTransferHistories = await getUserTransferHistories(wallet.account);
            setTransferHistories(userTransferHistories);

            const userName = await getUserName(wallet.account);

            dispatch(setUserName(userName));
        }

    }

    useEffect(() => {
        let interval = setInterval(loadBalance, 5000)
        return () => {
            clearInterval(interval)
        }
    }, [wallet])

    return <React.Fragment>
        <SideSheet isShown={isShown} onCloseComplete={() => setIsShown(false)}>
            <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
                <Pane padding={16} borderBottom="muted">
                    <Heading size={600}>用户 - {wallet.userName} -
                        <Pane style={{float: "right"}}>
                            <ChangeUserName />
                        </Pane>
                    </Heading>
                    <Paragraph size={400} color="muted">
                        用户资产和平台运营情况
                    </Paragraph>
                </Pane>
                <Pane display="flex" padding={8}>
                    <Tablist>
                        {['概览', '交易记录'].map((tab, index) => (
                            <Tab
                                key={tab}
                                isSelected={selectedIndex === index}
                                onSelect={() => setSelectedIndex(index)}
                            >
                                {tab}
                            </Tab>
                        ))}
                    </Tablist>
                </Pane>
            </Pane>
            {selectedIndex == 0 && <Pane flex="1" overflowY="scroll" background="tint1" padding={16}>
                <Card
                    backgroundColor="white"
                    elevation={0}
                    height={120}
                    display="flex"
                    flexDirection={"column"}
                    padding={16}
                >
                    <Pane flex={1} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                            <Text>
                                用户余额: {userBalance.div(decimal).toPrecision()} WISH
                            </Text>
                            <Withdraw />
                    </Pane>
                    <Pane flex={1} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Text>
                            用户ETH: {userEth.div(decimal).toPrecision()} ETH
                        </Text>
                    </Pane>
                </Card>
                <Card
                    backgroundColor="white"
                    marginTop={majorScale(2)}
                    elevation={0}
                    height={500}
                    display="flex"
                    flexDirection={"column"}
                    alignItems="flex-start"
                    padding={16}
                >
                    <Pane flex={0} display={"flex"} flexDirection={"column"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                        <Text>
                            WISH发行总量: {totalSupply.div(decimal).toPrecision()} WISH
                        </Text>
                        <Text marginTop={majorScale(1)}>
                            托管ETH总量: {contractEth.div(decimal).toPrecision()} ETH
                        </Text>
                        <Text marginTop={majorScale(1)}>
                            汇率: 1 WISH = {exchangeRate.toFormat(18)} ETH
                        </Text>
                    </Pane>
                    <Pane flex={1} marginTop={majorScale(1)} display={"flex"} alignItems={"center"} justifyContent={"center"} width="100%">
                        <Pane>
                            <Pie data={getData(contractEth.div(decimal).toNumber(), totalSupply.div(decimal).toNumber())} />
                        </Pane>
                    </Pane>

                </Card>
            </Pane>}
            {selectedIndex == 1 && <Pane flex="1" overflowY="scroll" background="tint1" padding={16}>
                <Table>
                    <Table.Head>
                        <Table.TextHeaderCell>Type</Table.TextHeaderCell>
                        <Table.TextHeaderCell>From</Table.TextHeaderCell>
                        <Table.TextHeaderCell>To</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Amount</Table.TextHeaderCell>
                    </Table.Head>
                    <Table.Body height={240}>
                        {transferHistories.map((profile) => (
                            <Table.Row key={profile.from + profile.to + profile.blockNum}>
                                <Table.TextCell>{profile.transferType}</Table.TextCell>
                                <Table.TextCell>{profile.from}</Table.TextCell>
                                <Table.TextCell>{profile.to}</Table.TextCell>
                                <Table.TextCell isNumber>{formatNumber(profile.amount)}</Table.TextCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Pane>}
        </SideSheet>
        <EvergreenLink color={'neutral'} marginRight={majorScale(3)} onClick={() => setIsShown(true)}>
            个人中心
        </EvergreenLink>
    </React.Fragment>

}

export default UserCenter
