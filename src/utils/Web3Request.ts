import Web3 from "web3";
import {WalletState} from "../feature/wallet/walletSlice";
import {AbiItem} from "web3-utils";
import {create, IPFSHTTPClient, CID} from "ipfs-http-client";
import store from "../app/store";
import WishApi from "../contracts/WishApi.json";
import WishToken from "../contracts/WishToken.json";
import Comptroller from "../contracts/Comptroller.json";


export function getMainContract(wallet: WalletState) {
    if(!window.web3) {
        window.web3 = new Web3(window.ethereum);
    }
    console.log(window.web3)

    return new window.web3.eth.Contract(
        Comptroller.abi as AbiItem[],
        wallet.configuration.mainContractAddress
    );
}

export function getIPFS(): IPFSHTTPClient | null {
    if (typeof window !== 'undefined' && window.ipfs) {
        return window.ipfs;
    }
    let ipfs: IPFSHTTPClient | undefined;
    try {
        ipfs = create({
            url: "http://127.0.0.1:5001/api/v0",

        });
        console.log(ipfs)
        if (typeof window !== 'undefined') {
            window.ipfs = ipfs;
        }
        return ipfs
    } catch (error) {
        console.error("IPFS error ", error);
        return null;
    }
}

export async function readJSONFromIPFS(path: string)  {
    const ipfs = getIPFS();
    if (!ipfs) {
        return null
    }
    const i = (await getIPFS() as IPFSHTTPClient).cat(path, {offset: 0})
    let result = "";
    const decoder = new TextDecoder();
    for await (const x of ipfs.get(path)) {
        result += decoder.decode(x);
    }
    const index = result.indexOf("{");
    const lastIndex = result.lastIndexOf("}")
    const jsonString  = result.substring(index, lastIndex + 1)
    return JSON.parse(jsonString);
}

export async function readImageFromIPFS(path: string)  {
    const ipfs = getIPFS();
    if (!ipfs) {
        return null
    }
    const i = (await getIPFS() as IPFSHTTPClient).cat(path, {offset: 0})
    let result = "";
    const decoder = new TextDecoder();
    for await (const x of ipfs.get(path)) {
        result += decoder.decode(x);
    }
    return result;
}

export function getWeb3(): Web3 {
    if (typeof window === 'undefined' || !window.web3) {
        const provider = new Web3.providers.HttpProvider(
            "HTTP://127.0.0.1:7545"
        );
        return new Web3(provider);
    }
    if (window.web3) {
        return window.web3
    }
    const provider = new Web3.providers.HttpProvider(
        "HTTP://127.0.0.1:7545"
    );
    const web3 = new Web3(provider);
    if (typeof window !== 'undefined') {
        window.web3 = web3;
    }
    return web3;
}

export async function getApiContract() {
    if (!store.getState().wallet) {
        return null;
    }
    const provider = new Web3.providers.HttpProvider(store.getState().wallet.configuration.networkAddress as string);
    const web3 = new Web3(provider);
    const apiAddress  = store.getState().wallet.configuration.apiContractAddress;
    return new web3.eth.Contract(WishApi.abi as AbiItem[], apiAddress);
}

export async function getTokenContract() {
    if (!store.getState().wallet) {
        return null;
    }
    const provider = new Web3.providers.HttpProvider(store.getState().wallet.configuration.networkAddress as string);
    const web3 = new Web3(provider);
    const tokenAddress  = store.getState().wallet.configuration.tokenAddress;
    return new web3.eth.Contract(WishToken.abi as AbiItem[], tokenAddress);
}

export async function getComptrollerContract() {
    if (!store.getState().wallet) {
        return null;
    }
    const provider = new Web3.providers.HttpProvider(store.getState().wallet.configuration.networkAddress as string);
    const web3 = new Web3(provider);
    const mainContractAddress  = store.getState().wallet.configuration.mainContractAddress;
    return new web3.eth.Contract(Comptroller.abi as AbiItem[], mainContractAddress);
}





