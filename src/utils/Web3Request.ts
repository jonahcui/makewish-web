import Web3 from "web3";
import {WalletState} from "../feature/wallet/walletSlice";
import {AbiItem} from "web3-utils";
import {create, IPFSHTTPClient, CID} from "ipfs-http-client";
import store from "../app/store";
import WishApi from "../contracts/WishApi.json";
import WishToken from "../contracts/WishToken.json";
import Comptroller from "../contracts/Comptroller.json";
import GoodLottery from "../contracts/GoodLottery.json";


export function getReadableWeb3() {
    if (typeof window === 'undefined') {
        return null;
    }
    if (typeof window === 'undefined' && window.web3) {
        return window.web3;
    }
    const provider = new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_ETH_RPC_URL as string);
    const web3 = new Web3(provider);
    if (typeof window !== 'undefined') {
        window.web3 = web3;
    }
    return web3;
}

export function getIPFS(): IPFSHTTPClient | null {
    if (typeof window !== 'undefined' && window.ipfs) {
        return window.ipfs;
    }
    let ipfs: IPFSHTTPClient | undefined;
    try {
        ipfs = create({
            url: process.env.NEXT_PUBLIC_IPFS_API,

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

export function openIPFSImage(path: string) {
    if (!path) {
        return "/wish.png";
    }
    return process.env.NEXT_PUBLIC_IPFS_HOST + path
}

export function getWeb3(): Web3 {
    if (typeof window === 'undefined' || !window.web3) {
        const provider = new Web3.providers.HttpProvider(
            process.env.NEXT_PUBLIC_ETH_RPC_URL as string
        );
        return new Web3(provider);
    }
    if (window.web3) {
        return window.web3
    }
    const provider = new Web3.providers.HttpProvider(
        process.env.NEXT_PUBLIC_ETH_RPC_URL as string
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
    const provider = new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_ETH_RPC_URL as string);
    const web3 = getReadableWeb3();
    if (!web3) {
        return null;
    }
    return new web3.eth.Contract(WishApi.abi as AbiItem[], process.env.NEXT_PUBLIC_CONTRACT_API);
}

export async function getTokenContract() {
    if (!store.getState().wallet) {
        return null;
    }
    const web3 = new Web3(window.ethereum);
    return new web3.eth.Contract(WishToken.abi as AbiItem[], process.env.NEXT_PUBLIC_CONTRACT_TOKEN);
}

export async function getGoodContract(address: string) {
    if (!store.getState().wallet) {
        return null;
    }
    const web3 = new Web3(window.ethereum);
    return new web3.eth.Contract(GoodLottery.abi as AbiItem[], address);
}

export async function getComptrollerContract() {
    if (!store.getState().wallet) {
        return null;
    }
    const web3 = new Web3(window.ethereum);
    return new web3.eth.Contract(Comptroller.abi as AbiItem[], process.env.NEXT_PUBLIC_CONTRACT_MAIN);
}


export async function deployComptroller() {
    if (!store.getState().wallet) {
        return null;
    }
    const web3 = new Web3(window.ethereum);
    const instance = new web3.eth.Contract(Comptroller.abi as AbiItem[]);
    const resp = await instance.deploy({data: Comptroller.bytecode, arguments: [1]}).send({
        from: store.getState().wallet.account as string,
        value: "1000000000000000000",
        gas: 7200000
    })
    console.log("deploy comptroller response: ", resp);
    console.log("deploy comptroller address: ", resp.options.address);
    const newInstance = new web3.eth.Contract(Comptroller.abi as AbiItem[], resp.options.address);
    const tokenAddressResp = await newInstance.methods.token().call();
    return {mainContractAddress: resp.options.address, tokenAddress: tokenAddressResp}
}

export async function deployWishApi(comptrollerAddress: string) {
    if (!store.getState().wallet) {
        return null;
    }
    const web3 = new Web3(window.ethereum);
    const instance = new web3.eth.Contract(WishApi.abi as AbiItem[]);
    const resp = await instance.deploy({data: WishApi.bytecode, arguments: [comptrollerAddress]}).send({
        from: store.getState().wallet.account as string,
        gas: 5000000,
        gasPrice: '1000000000'
    })
    console.log("deploy wish api response: ", resp);
    console.log("deploy wish api address: ", resp.options.address);
    return resp.options.address
}





