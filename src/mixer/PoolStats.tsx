import styles from "../styles/Home.module.css";
import Stats from "../layout/Stats";
import {AccountStats, ContractStats} from "../utils/contracts";

export function PoolStats(props: { contractStats: ContractStats, accountStats: AccountStats }) {
    return (
        <div className={styles.card}>
            <div className={styles.center}><h3>Pool stats</h3></div>
            <hr/>
            <div className={styles.between}>
                <Stats name={"Total balance"} value={`${props.accountStats?.spendable_balance || "..."} ꜩ`}/>
                <Stats name={"Deposits"} value={props.contractStats?.call_stats.deposit || "..."}/>
                <Stats name={"Withdrawals"} value={props.contractStats?.call_stats.withdraw || "..."}/>
            </div>
        </div>
    )
}