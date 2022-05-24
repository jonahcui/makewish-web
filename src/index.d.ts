import Web3 from "web3";
import {IPFSHTTPClient} from "ipfs-http-client";

declare global {
    interface Window {
        ethereum: any;
        web3?: Web3;
        ipfs: IPFSHTTPClient | undefined;
    }
}
