import Web3 from "web3";

export async function getConfiguration() {
        const response = await fetch('/config.json', {
            method: 'GET',
        })
        return await response.json()
}

export async function connectWallet(): Promise<{account: string, chainId: string}> {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return {account: accounts[0], chainId: window.ethereum.chainId }
}

