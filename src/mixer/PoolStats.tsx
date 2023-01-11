import styles from "../styles/Home.module.css";
import Stats from "../layout/Stats";
import {AccountStats, ContractStats} from "../utils/contracts";

export function PoolStats(props: { contractStats: ContractStats, accountStats: AccountStats }) {
    return (
        <div className={styles.card}>
            <div className={styles.center}><h3>Pool stats</h3></div>
            <hr/>
            <div className={styles.center}>
                <div className={styles.row}>
                    <div className={styles.column}><Stats name={"Total balance"}
                                                          value={`${props.accountStats?.spendable_balance || "..."} ꜩ`}/>
                    </div>
                    <div className={styles.column}><Stats name={"Deposits"}
                                                          value={props.contractStats?.call_stats.deposit || "..."}/>
                    </div>
                    <div className={styles.column}><Stats name={"Withdrawals"}
                                                          value={props.contractStats?.call_stats.withdraw || "..."}/>
                    </div>
                </div>
            </div>
        </div>
    )
}