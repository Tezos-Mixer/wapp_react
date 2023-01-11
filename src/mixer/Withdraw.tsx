import {useContext, useState} from "react";
import styles from "../styles/Home.module.css"
import toast from "react-hot-toast";
import {getPoolAddress} from "../utils/pool";
import {hash} from "../utils/maths";
import {validateAddress} from "@taquito/utils";
import Loader from "../components/Loader";
import {NetworkContext} from "../tezos/NetworkContext";

export default function Withdraw(props: { pool: number, setPool: (pool: number) => void }) {
    const {mainnet} = useContext(NetworkContext);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        recipientAddress: "",
        depositNote: "",
        merkleProof: "",
    })

    const handleChange = (e: any, field: string) => {
        setForm(prevState => ({...prevState, [field]: e.target.value}))
    }

    const withdrawFromPool = async (nullifier: string, merkleProof: string, withdrawAddress: string) => {
        if (validateAddress(withdrawAddress) === 3) {
            const contractAddress = getPoolAddress(props.pool);
            const hashedCommitment = await hash(nullifier);

            await fetch(process.env.REACT_APP_RELAYER_URL + `mainnet=${mainnet}&address=${withdrawAddress}&proof=${merkleProof}&pool=${props.pool}&contract=${contractAddress}&note=${hashedCommitment}`)
                .then((response) => response.json())
                .then((json) => {
                    console.log(json);
                    toast.success("Successfully executed function!")
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("An error occurred")
                })

            setLoading(false);
        } else {
            toast.error("Invalid address!");
            setLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);
                withdrawFromPool(form.depositNote, form.merkleProof, form.recipientAddress);
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
                    {loading ? <Loader show={true}/> : <button
                        className={styles.action}
                        type={"submit"}
                    >
                        Withdraw
                    </button>}
                </div>
                <p/>
            </form>
        </div>
    )
}