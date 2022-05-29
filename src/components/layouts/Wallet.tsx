import React, {useCallback} from 'react'
import MetaMaskOnboarding from '@metamask/onboarding';
import {Badge, CornerDialog, Link as EvergreenLink, majorScale, Pane, Text} from "evergreen-ui";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectWallet, setAccount, setChainId, setStatus, WalletState} from "../../feature/wallet/walletSlice";
import MetamaskAPI from "../../utils/metamask"

function Wallet() {
    const dispatch = useAppDispatch()
    const wallet = useAppSelector(selectWallet)
    const onboarding = React.useRef();

    React.useEffect(() => {
        if (!onboarding.current) {
            // @ts-ignore
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);

    React.useEffect(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            if (wallet.account) {
                dispatch(setStatus('CONNECTED'))
                // @ts-ignore
                onboarding.current.stopOnboarding();
            } else {
                dispatch(setStatus('INSTALLED'))
            }
        }
    }, [wallet.account]);

    React.useEffect(() => {
        function handleNewAccounts(newAccounts?: string[]) {
            if(newAccounts && newAccounts.length > 0) {
               dispatch(setAccount(newAccounts[0]))
            }
        }
        function handleChainId(chainId?: string) {
            dispatch(setChainId(chainId as string))
        }
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            MetamaskAPI.requestAccount().then(handleNewAccounts);
            MetamaskAPI.requestChainId().then(handleChainId)

            MetamaskAPI.onAccountsChanged(handleNewAccounts);
            MetamaskAPI.onChainChange(handleChainId);
            return () => {
                MetamaskAPI.offAccountsChanged(handleNewAccounts);
                MetamaskAPI.offChainChange(handleChainId);
            };
        }
    }, []);

    const onClick = () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            if (wallet.status === 'CONNECTED' && wallet.chainId != process.env.NEXT_PUBLIC_WEB3_CHAIN_ID) {
                MetamaskAPI.requestPermission()
            } else if (wallet.status === 'CONNECTED') {
                return;
            }
            MetamaskAPI.requestAccount()
                .then((newAccounts: string[]) => {
                    if(newAccounts && newAccounts.length > 0) {
                        console.log(window.ethereum.chainId)
                        dispatch(setAccount(newAccounts[0]))
                    }
                });
            MetamaskAPI.requestChainId()
                .then((chainId: string) => {
                    dispatch(setChainId(chainId))
                })
        } else {
            // @ts-ignore
            onboarding.current.startOnboarding();
        }
    };
    const renderConnectedComponent = (wallet: WalletState) => {
        if (wallet.chainId == process.env.NEXT_PUBLIC_WEB3_CHAIN_ID) {
            return maskAccount(wallet.account) + ' (chain: ' + wallet.chainId +')'
        }

        return <Badge color="red">
            {maskAccount(wallet.account) + ' (不支持当前网络:' + wallet.chainId +')'}
        </Badge>
    }

    const changeChainId = async () => {
        await MetamaskAPI.addChain();
        await MetamaskAPI.addNetwork();
        await MetamaskAPI.switchChain();
    }
    const toolTip = useCallback(() => {
        if (wallet.status === 'NOT_INSTALLED') {
            return <CornerDialog
                title="您还未安装数字钱包"
                isShown={wallet.status === 'NOT_INSTALLED'}
                cancelLabel={"我知道了"}
                confirmLabel={"安装(Chrome官方商店)"}
                onConfirm={onClick}
            >
                <Pane>
                    我们检测到您还未安装数字钱包（MetaMask）, 请安装后体验。
                    不推荐使用国内下载地址，有安全风险，请谨慎下载。
                </Pane>
            </CornerDialog>
        }
        if(wallet.status === 'CONNECTED' && wallet.chainId != process.env.NEXT_PUBLIC_WEB3_CHAIN_ID) {
            return <CornerDialog
                title="不支持的网络"
                isShown={wallet.status === 'CONNECTED' && wallet.chainId != process.env.NEXT_PUBLIC_WEB3_CHAIN_ID}
                cancelLabel={"不切换"}
                confirmLabel={"切换网络"}
                onConfirm={changeChainId}
            >
                <Pane>
                    <Text>
                        MAKEWISH目前不支持该网络({wallet.chainId})，请切换到{process.env.NEXT_PUBLIC_WEB3_CHAIN_ID}. 由于使用http方式部署， 切换网络可能会被拦截，请手动添加:
                    </Text>
                    <Pane marginTop={majorScale(2)}></Pane>
                    <Text marginTop={majorScale(2)}>
                        RPC地址为：{process.env.NEXT_PUBLIC_ETH_RPC_URL}
                    </Text>
                    <br/>
                    <Text>
                        networkId: {process.env.NEXT_PUBLIC_WEB3_NETWORK_ID}
                    </Text>
                </Pane>
            </CornerDialog>
        }
        return <div/>;
    }, [wallet, onClick, changeChainId])
    return (
            <div>
                <EvergreenLink color={wallet.status !== "CONNECTED" ? "primary" : undefined} marginRight={majorScale(3)} onClick={onClick}>
                    {wallet.status === 'NOT_INSTALLED' && '安装数字钱包，即可体验'}
                    {wallet.status === 'INSTALLED' && '连接钱包, 赢取好礼'}
                    {wallet.status === 'CONNECTED' && renderConnectedComponent(wallet)}
                </EvergreenLink>

                {toolTip()}
            </div>
    );
}

function maskAccount(account?: string) {
    if (!account) {
        return ''
    }
    if (account.length < 20) {
        return ''
    }
    return account.slice(0, 6) + "****" + account.slice(account.length - 4, account.length)
}

export default Wallet;
