import Web3 from "web3";

export async function connectWallet(): Promise<Web3> {
    const web3 = new Web3(window.ethereum);
    // Ask User permission to connect to Metamask
    await window.ethereum.enable();
    return web3
}

