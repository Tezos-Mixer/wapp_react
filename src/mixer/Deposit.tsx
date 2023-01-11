import {useContext, useState} from "react";
import styles from "../styles/Home.module.css";
import {WalletContext} from "../tezos/WalletContext";
import WalletButton from "../components/WalletButton";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import {char2Bytes} from "@taquito/utils";
import {generateRandomString, hash} from "../utils/maths";
import {getPoolAddress, getTreeAddress} from "../utils/pool";

export default function Deposit(props: { pool: number, setPool: (pool: number) => void, mixingFees: number; setShowModal: (show: boolean) => void; setTxUrl: (url: string) => void; setDepositNote: (note: string) => void }) {
    const {tezos, address, balance} = useContext(WalletContext);
    const [loading, setLoading] = useState(false);

    const depositFunds = async () => {
        const poolContractAddress = getPoolAddress(props.pool);
        const treeContractAddress = getTreeAddress(props.pool);

        const depositNote = "DN-" + generateRandomString(40);
        props.setDepositNote(depositNote);

        const hashedDepositNote = await hash(depositNote);
        const coin = char2Bytes(hashedDepositNote);

        if (!poolContractAddress || !treeContractAddress) {
            toast.error(`No ${props.pool} tz ${poolContractAddress ? "tree" : (treeContractAddress ? "pool" : "pool/tree")} contract has been deployed yet`);
            setLoading(false);
            return;
        }

        if (tezos) {
            tezos.wallet
                .at((poolContractAddress!))
                .then((c: any) => {
                    return c.methods.deposit(coin).send({
                        amount: props.pool
                    });
                })
                .then((op: any) => {
                    props.setShowModal(true);
                    toast("Waiting for transaction to be confirmed...");
                    return op.confirmation(3)
                        .then(() => {
                            return op.hash;
                        });
                })
                .then((hash: string) => {
                    const _txUrl = `https://${process.env.REACT_APP_TESTNET_NAME?.toLowerCase()}.tzstats.com/${hash}`
                    props.setTxUrl(_txUrl);
                    toast.success("Successful transaction!");
                    setLoading(false);
                })
                .catch((error: any) => {
                    toast.error(error.toString());
                    setLoading(false);
                });
        }
    }

    return (
        <div>
            {address && <>
                <div className={styles.center}>
                    <h3>Current balance</h3>
                </div>
                <input
                    value={balance + " ꜩ"}
                    disabled={true}
                />
                <hr/>
            </>}
            <div className={"center"}>
                <b>
                    Selected pool
                </b>
            </div>
            <input
                value={props.pool + " ꜩ"}
                disabled={true}
            />
            <p/>
            <div className={"center"}>
                <b>
                    Mixing fees
                </b>
            </div>
            <input
                value={props.mixingFees + " ꜩ"}
                disabled={true}
            />
            <hr/>
            <div className={"center"}>
                <h3>
                    Total mixed amount
                </h3>
            </div>
            <input
                value={props.pool - props.mixingFees + " ꜩ"}
                disabled={true}
            />
            <p/>
            <div className={styles.center}>
                {address ? loading ? <Loader show={true}/> : <button
                    className={balance < props.pool ? styles.disabled : styles.action}
                    onClick={() => {
                        setLoading(true);
                        depositFunds().catch((error) => console.log(error));
                    }}
                    disabled={balance < props.pool}
                >
                    Deposit
                </button> : <WalletButton/>}
            </div>
            <p/>
        </div>
    )
}