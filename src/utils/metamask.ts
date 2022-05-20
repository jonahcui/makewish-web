import {WalletState} from "../feature/wallet/walletSlice";

export interface EthereumResponse {
    result?: any
    error?: any
}

async function requestAccount() : Promise<string[]> {
    return await window.ethereum.request({ method: 'eth_requestAccounts' });
}

function onAccountsChanged(handler: (accounts?: string[]) => void) {
    window.ethereum.on('accountsChanged', handler);
}

function offAccountsChanged(handler: (accounts?: string[]) => void) {
    window.ethereum.removeListener('accountsChanged', handler);
}

function onChainChange(handler: (chainId?: string) => void) {
    window.ethereum.on('chainChanged', handler)
}

function offChainChange(handler: (chainId?: string) => void) {
    window.ethereum.removeListener('chainChanged', handler)
}

async function requestChainId() : Promise<string> {
    return await window.ethereum.request({ method: 'eth_chainId'});
}

async  function requestPermission(): Promise<void> {
    return await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{
        "eth_accounts": {}
        }]})
}

async function addNetwork(wallet: WalletState): Promise<EthereumResponse> {
    try {
        const result = await  window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {

                    "chainId": wallet.configuration.chainId,
                    "chainName": wallet.configuration.networkName,
                    "rpcUrls": [
                        wallet.configuration.networkAddress
                    ],
                    "iconUrls": [
                        "https://xdaichain.com/fake/example/url/xdai.svg",
                    ],
                    "nativeCurrency": {
                        "name": "ETH",
                        "symbol": "ETH",
                        "decimals": 18
                    },
                }]
        })
        return {
            result,
        }
    } catch (e) {
        return {
            error: e
        };
    }
}

async function switchChain(wallet: WalletState): Promise<EthereumResponse> {
    try {
        const permissions = await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{
                chainId: wallet.configuration.chainId,
            }]
        });
        return {result: permissions}
    } catch (e) {
        return {
            error: e
        };
    }
}

async function addAssert(wallet: WalletState): Promise<EthereumResponse> {
    return window.ethereum.request({
        method: 'wallet_watchAsset',
        params:{
            "type": "ERC20",
            "options": {
                "address": wallet.configuration.tokenAddress,
                "symbol": "WISH",
                "decimals": 18,
                "image": wallet.configuration.tokenImage || (window.location.host + 'wish-coin.png')
            }
        }
    })
}

export default {
    addNetwork,
    switchChain,
    requestAccount,
    requestChainId,
    onAccountsChanged,
    offAccountsChanged,
    onChainChange,
    offChainChange,
    requestPermission,
    addAssert
}
