import {useContext, useState} from "react";
import styles from "../styles/Home.module.css"
import Pools from "./Pools";
import toast from "react-hot-toast";
import {getPoolAddress} from "../utils/pool";
import {WalletContext} from "../tezos/WalletContext";
import {hash} from "../utils/maths";
import {char2Bytes, validateAddress} from "@taquito/utils";
import Loader from "../components/Loader";
import WalletButton from "../components/WalletButton";

export default function Withdraw(props: { pool: number, setPool: (pool: number) => void }) {
    const {tezos, address} = useContext(WalletContext);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        recipientAddress: "",
        depositNote: "",
        merkleProof: "",
    })

    const handleChange = (e: any, field: string) => {
        setForm(prevState => ({...prevState, [field]: e.target.value}))
    }

    const withdraw = async (nullifier: string, merkleProof: string, withdrawAddress: string) => {
        if (validateAddress(withdrawAddress) === 3) {
            const contractAddress = getPoolAddress(props.pool);

            const hashedCommitment = await hash(nullifier);
            const commitment = char2Bytes(hashedCommitment);
            const proofRecord = {a: merkleProof, b: "a"}

            if (tezos) {
                tezos.wallet
                    .at(contractAddress as string)
                    .then((c: any) => {
                        return c.methodsObject.withdraw({
                            nullifier: commitment,
                            proof: proofRecord,
                            withdrawal_address: withdrawAddress
                        }).send();
                    })
                    .then((op: any) => op.confirmation())
                    .then(() => {
                        toast.success("Successful transaction!");
                        setLoading(false);
                    })
                    .catch((error: any) => {
                        toast.error(error.toString());
                        console.log(error);
                        setLoading(false);
                    });
            }
        } else {
            toast.error("Invalid address!");
            setLoading(false);
        }
    }

    return (
        <div className={styles.card}>
            <div className={"center"}>
                <h2>Pool to withdraw from</h2>
            </div>
            <p/>
            <Pools pool={props.pool} setPool={props.setPool}/>
            <hr/>
            <form onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);
                withdraw(form.depositNote, form.merkleProof, form.recipientAddress);
            }}>
                <div className={"center"}>
                    <b>
                        Recipient address
                    </b>
                </div>
                <input
                    name={"recipient"}
                    type={"text"}
                    value={form.recipientAddress}
                    onChange={e => handleChange(e, "recipientAddress")}
                />
                <p/>
                <div className={"center"}>
                    <b>
                        Deposit note
                    </b>
                </div>
                <input
                    name={"depositNote"}
                    type={"text"}
                    value={form.depositNote}
                    onChange={e => handleChange(e, "depositNote")}
                />
                <p/>
                <div className={"center"}>
                    <b>
                        Merkle proof
                    </b>
                </div>
                <input
                    name={"merkleProof"}
                    type={"text"}
                    value={form.merkleProof}
                    onChange={e => handleChange(e, "merkleProof")}
                />
                <hr/>
                <p/>
                <div className={styles.center}>
                    {address ? loading ? <Loader show={true}/> : <button
                        className={styles.action}
                        type={"submit"}
                    >
                        Withdraw
                    </button> : <WalletButton/>}
                </div>
                <p/>
            </form>
        </div>
    )
}