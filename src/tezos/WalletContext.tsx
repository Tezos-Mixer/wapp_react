import {createContext} from "react";
import {TezosToolkit} from "@taquito/taquito";
import {BeaconWallet} from "@taquito/beacon-wallet";

const tezos = new TezosToolkit(process.env.REACT_APP_TESTNET_URL as string);

const walletOptions = {
    name: "On-chain mixer",
    preferredNetwork: "testnet",
}

const wallet = new BeaconWallet(walletOptions as any);

export const WalletContext = createContext({
    tezos: tezos,
    setTezos: (value: any) => {
        console.log(value)
    },
    wallet: wallet,
    setWallet: (value: any) => console.log(value),
    address: "",
    setAddress: (value: string) => {
        console.log(value)
    },
    balance: 0,
    setBalance: (value: number) => {
        console.log(value)
    }
});