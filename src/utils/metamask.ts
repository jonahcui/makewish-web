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

async function addChain(): Promise<EthereumResponse> {
    try {
        const result = await  window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {

                    "chainId": process.env.NEXT_PUBLIC_WEB3_CHAIN_ID,
                    "chainName": "WISH Network",
                    "rpcUrls": [
                        process.env.NEXT_PUBLIC_ETH_RPC_URL
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

async function addNetwork(): Promise<EthereumResponse> {
    try {
        const result = await  window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {

                    "chainId": process.env.NEXT_PUBLIC_WEB3_CHAIN_ID,
                    "chainName": "WISH Network",
                    "rpcUrls": [
                       process.env.NEXT_PUBLIC_ETH_RPC_URL
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

async function switchChain(): Promise<EthereumResponse> {
    try {
        const permissions = await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{
                chainId: process.env.NEXT_PUBLIC_WEB3_CHAIN_ID,
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
                "address": process.env.NEXT_PUBLIC_CONTRACT_TOKEN,
                "symbol": "WISH",
                "decimals": 18,
                "image": process.env.NEXT_PUBLIC_TOKEN_IMAGE
            }
        }
    })
}

export default {
    addChain,
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
