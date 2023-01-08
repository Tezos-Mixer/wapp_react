import {useContext, useState} from "react";
import styles from "../styles/Home.module.css";
import Modal from "../components/Modal";
import {WalletContext} from "../tezos/WalletContext";
import WalletButton from "../components/WalletButton";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import {char2Bytes} from "@taquito/utils";
import {hash} from "../utils/maths";
import {getPoolAddress} from "../utils/pool";
import Note from "./Note";
import Pools from "./Pools";

export default function Deposit(props: { pool: number, setPool: (pool: number) => void, mixingFees: number }) {
    const [showModal, setShowModal] = useState(false);
    const {tezos, address, balance} = useContext(WalletContext);
    const [loading, setLoading] = useState(false);
    // const depositNote = generateDepositNote();
    const [txUrl, setTxUrl] = useState("");

    const deposit = async (_commitment: string) => {
        const contractAddress = getPoolAddress(props.pool);
        const hashedCommitment = await hash(_commitment);
        const commitment = char2Bytes(hashedCommitment);

        if (tezos) {
            tezos.wallet
                .at((contractAddress!))
                .then((c: any) => {
                    return c.methods.deposit(commitment).send({
                        amount: props.pool
                    });
                })
                .then((op: any) => {
                    toast("Waiting for transaction to be confirmed...");
                    return op.confirmation(3)
                        .then(() => {
                            return op.hash;
                        });
                })
                .then((hash: string) => {
                    const _txUrl = `https://${process.env.REACT_APP_TESTNET_NAME?.toLowerCase()}.tzstats.com/${hash}`
                    setTxUrl(_txUrl);
                    toast.success("Successful transaction!");
                    setShowModal(true);
                    setLoading(false);
                })
                .catch((error: any) => {
                    toast.error(error.toString());
                    setLoading(false);
                });
        }
    }

    return (
        <div className={styles.card}>
            <Modal content={<Note txUrl={txUrl} depositNote={"depositNote"} handleClose={() => setShowModal(false)}/>}
                   show={showModal}
                   handleClose={() => setShowModal(false)}
            />
            {address && <>
                <h3>Current balance</h3>
                <input
                    value={balance + " ꜩ"}
                    disabled={true}
                />
                <hr/>
            </>}
            <div className={"center"}>
                <h2>
                    Amount to mix
                </h2>
            </div>
            <p/>
            <Pools pool={props.pool} setPool={props.setPool}/>
            <hr/>
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
                <h2>
                    Total mixed amount
                </h2>
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
                        deposit("depositNote");
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