import Web3 from "web3";
import store from "../app/store";

export const EXPLORE_URL = process.env.NEXT_PUBLIC_ANALYTICS_ID


export const openAddress = (address: string) => {
    return window.open(process.env.NEXT_PUBLIC_EXPLORE_URL + 'address/' + address)
}

export const openBlock = async (block: any) => {
    const provider = new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_ETH_RPC_URL as string);
    const web3 = new Web3(provider);
    const blockInfo = await web3.eth.getBlock(block);
    console.log(blockInfo);
    return window.open(process.env.NEXT_PUBLIC_EXPLORE_URL + 'block/' + blockInfo.hash)
}
