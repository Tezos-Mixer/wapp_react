import styles from "../styles/Header.module.css";
import {reduceWalletAddress} from "../utils/string";
import toast from "react-hot-toast";
import {useContext} from "react";
import {NetworkContext} from "../tezos/NetworkContext";
import {WalletContext} from "../tezos/WalletContext";
import {NetworkType} from "@airgap/beacon-sdk";
import {Wallet} from "react-bootstrap-icons";
import {BeaconWallet} from "@taquito/beacon-wallet";
import * as buffer from "buffer";

window.Buffer = buffer.Buffer;

export default function WalletButton() {
    const {mainnet, network} = useContext(NetworkContext);
    const {tezos, setTezos, wallet, setWallet, address, setAddress, setBalance} = useContext(WalletContext);

    const forcePermissionRequest = (wallet: BeaconWallet) => {
        return wallet.requestPermissions({
            network: {
                type: mainnet ? NetworkType.MAINNET : NetworkType.GHOSTNET,
                rpcUrl: network,
            }
        })
    }

    const connectWallet = async () => {
        if (wallet) {
            forcePermissionRequest(wallet)
                .then(() => {
                    toast.success("Wallet connected");
                    wallet.getPKH()
                        .then((address: string) => {
                            setAddress(address);
                            setWallet(wallet);
                            tezos?.setWalletProvider(wallet);
                            setTezos(tezos);
                            tezos?.tz.getBalance(address).then((balance: any) => setBalance(Math.floor(balance / 10 ** 4) / 100));
                        })
                        .catch((error: any) => console.log(error));
                })
                .catch((reason: any) => {
                    toast.error(reason.description);
                });
        }
    }

    const disconnectWallet = () => {
        if (wallet) {
            setAddress("");
            wallet
                .clearActiveAccount()
                .catch((error: any) => console.log(error));
            toast.success("Wallet disconnected")
        }
    }

    return (
        <>
            {!address ?
                <button
                    className={styles.wallet}
                    onClick={() => connectWallet()}
                >
                    <Wallet/> Connect wallet
                </button>
                :
                <button
                    className={styles.connected}
                    onClick={() => disconnectWallet()}
                >
                    <div className={styles.flex}>
                        <span className={styles.dot}></span>
                        {reduceWalletAddress(address)}
                        <span
                            className={styles.muted}>({mainnet ? process.env.REACT_APP_MAINNET_NAME : process.env.REACT_APP_TESTNET_NAME})</span>
                    </div>
                </button>
            }
        </>
    )
}