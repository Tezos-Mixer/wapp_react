import styles from "../styles/Home.module.css"
import {useContext} from "react";
import {NetworkContext} from "../tezos/NetworkContext";
import {Transaction} from "../utils/contracts";


export default function PoolHistory(props: { selected: string; transactions: Transaction[]; transactionsLoaded: boolean }) {
    const {mainnet} = useContext(NetworkContext);

    function getDaysSinceDate(date: string) {
        const currentDate = new Date();
        const txDate = new Date(date);

        const timeDifference = Math.abs(currentDate.getTime() - txDate.getTime());

        const minutesDifference = Math.floor(timeDifference / (1000 * 60))
        const hoursDifference = Math.floor(minutesDifference / 60);
        const daysDifference = Math.floor(hoursDifference / 24);

        const result = daysDifference > 0 ? daysDifference : hoursDifference > 0 ? hoursDifference : minutesDifference;
        const resultType = daysDifference > 0 ? "day" : hoursDifference > 0 ? "hour" : "minute";

        return result > 0 ? result + ` ${resultType}${result > 1 ? "s" : ""} ago` : "Just now";
    }


    return (
        <div className={styles.card}>
            <div className={styles.center}><h3>Last pool contract calls</h3></div>
            <hr/>
            <div className={styles.list}>
                {props.transactions.length > 0 ? props.transactions.map((transaction: Transaction) => (
                    transaction.parameters.entrypoint === props.selected &&
                    <a key={transaction.id} href={`https://${!mainnet && "ghost."}tzstats.com/${transaction.hash}`}
                       target="_blank">
                        <div className={styles.transaction}>
                        <span className={styles.date}>
                            {getDaysSinceDate(transaction.time)}
                        </span>
                            <div className={""}>
                                <b>{transaction.parameters.entrypoint}</b>
                                <span className={styles.muted}>
                                ({transaction.hash.slice(0, 5) + "..."})
                            </span>
                            </div>
                        </div>
                    </a>
                )) : <div className={styles.transaction}>
                        <span className={styles.date}>
                            No data
                        </span>
                    No data
                </div>}
            </div>
        </div>
    )
}