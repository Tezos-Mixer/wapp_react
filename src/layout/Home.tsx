import React, {useState} from 'react';
import styles from "../styles/Home.module.css";
import Deposit from "../mixer/Deposit";
import History from "../mixer/History";
import Withdraw from "../mixer/Withdraw";

export function Home() {
    const [selected, setSelected] = useState("deposit");
    const [pool, setPool] = useState(1);
    const mixingFees = 0.1;

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.flex}>
                    <button
                        className={selected === "deposit" ? styles.selected : styles.unselected}
                        onClick={() => setSelected("deposit")}
                    >
                        Deposit
                    </button>
                    <button
                        className={selected === "withdraw" ? styles.selected : styles.unselected}
                        onClick={() => setSelected("withdraw")}
                    >
                        Withdraw
                    </button>
                </div>
                {selected === "deposit" ?
                    <Deposit pool={pool} setPool={setPool} mixingFees={mixingFees}/>
                    :
                    <Withdraw pool={pool} setPool={setPool}/>
                }
                <History/>
            </main>
        </div>
    );
}