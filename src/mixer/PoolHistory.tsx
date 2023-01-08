import styles from "../styles/Home.module.css"
import {useContext, useEffect, useState} from "react";
import {NetworkContext} from "../tezos/NetworkContext";

interface Transaction {
    block: string;
    burned: number;
    code_hash: string;
    confirmations: number;
    counter: number;
    cycle: number;
    fee: number;
    gas_limit: number;
    gas_used: number;
    hash: string;
    height: number;
    id: number;
    is_contract: boolean;
    is_success: boolean;
    op_n: number;
    op_p: number;
    parameters: {
        entrypoint: string;
        value: string;
    };
    receiver: string;
    sender: string;
    status: string;
    storage_limit: number;
    storage_paid: number;
    time: string;
    type: string;
    volume: number;
}

export default function PoolHistory() {
    const contractAddress = process.env.REACT_APP_10_XTZ_POOL_CONTRACT_ADDRESS;
    const {mainnet} = useContext(NetworkContext);

    const url = `https://api.${!mainnet && "ghost."}tzstats.com/explorer/contract/${contractAddress}/calls`;
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionsLoaded, setTransactionsLoaded] = useState(false);

    function getDaysSinceDate(date: string) {
        const currentDate = new Date();
        const txDate = new Date(date);

        const timeDifference = Math.abs(currentDate.getTime() - txDate.getTime());
        return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    }

    useEffect(() => {
        if (!transactionsLoaded) {
            setTransactionsLoaded(true);

            fetch(url)
                .then(response => response.json())
                .then((calls: Transaction[]) => {
                    return calls
                        .filter((call: Transaction) => call.type === "transaction")
                        .sort((a, b) => b.id - a.id);
                })
                .then((transactions: Transaction[]) => {
                    const array: Transaction[] = [];
                    transactions.forEach((transaction: Transaction) => {
                        array.push(transaction);
                    })
                    setTransactions(array);
                    console.log(transactions);
                })
                .catch((error) => console.log(error))
        }
    }, [url, transactionsLoaded]);

    return (
        <div className={styles.card}>
            <div className={styles.center}><h3>Last pool contract calls</h3></div>
            <hr/>
            {transactions.map((transaction: Transaction) => (
                <a key={transaction.id} href={`https://${!mainnet && "ghost."}tzstats.com/${transaction.hash}`}>
                    <div className={styles.transaction}>
                        <span className={styles.date}>
                            {getDaysSinceDate(transaction.time) + ` day${getDaysSinceDate(transaction.time) > 1 ? "s" : ""} ago`}
                        </span>
                        <div className={""}>
                            <b>{transaction.parameters.entrypoint}</b>
                            <span className={styles.muted}>
                                ({transaction.hash.slice(0, 5) + "..."})
                            </span>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    )
}