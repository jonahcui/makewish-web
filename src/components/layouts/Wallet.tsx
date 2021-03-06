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
            {maskAccount(wallet.account) + ' (?????????????????????:' + wallet.chainId +')'}
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
                title="???????????????????????????"
                isShown={wallet.status === 'NOT_INSTALLED'}
                cancelLabel={"????????????"}
                confirmLabel={"??????(Chrome????????????)"}
                onConfirm={onClick}
            >
                <Pane>
                    ?????????????????????????????????????????????MetaMask???, ?????????????????????
                    ????????????????????????????????????????????????????????????????????????
                </Pane>
            </CornerDialog>
        }
        if(wallet.status === 'CONNECTED' && wallet.chainId != process.env.NEXT_PUBLIC_WEB3_CHAIN_ID) {
            return <CornerDialog
                title="??????????????????"
                isShown={wallet.status === 'CONNECTED' && wallet.chainId != process.env.NEXT_PUBLIC_WEB3_CHAIN_ID}
                cancelLabel={"?????????"}
                confirmLabel={"????????????"}
                onConfirm={changeChainId}
            >
                <Pane>
                    <Text>
                        MAKEWISH????????????????????????({wallet.chainId})???????????????{process.env.NEXT_PUBLIC_WEB3_CHAIN_ID}. ????????????http??????????????? ????????????????????????????????????????????????:
                    </Text>
                    <Pane marginTop={majorScale(2)}></Pane>
                    <Text marginTop={majorScale(2)}>
                        RPC????????????{process.env.NEXT_PUBLIC_ETH_RPC_URL}
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
                    {wallet.status === 'NOT_INSTALLED' && '?????????????????????????????????'}
                    {wallet.status === 'INSTALLED' && '????????????, ????????????'}
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
