import React, {useState} from 'react';
import styles from "../styles/Home.module.css";
import Deposit from "../mixer/Deposit";
import PoolHistory from "../mixer/PoolHistory";
import Withdraw from "../mixer/Withdraw";
import {PoolStats} from "../mixer/PoolStats";

export function Home() {
    const [selected, setSelected] = useState("deposit");
    const [pool, setPool] = useState(1);
    const mixingFees = 0.1;

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.center}>
                    <div className={styles.card}>
                        <p/>
                        <div className={styles.center}>
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
                        </div>
                        <p/>
                    </div>
                    <div className={styles.flex}>
                        <div className={styles.column}>

                            {selected === "deposit" ?
                                <Deposit pool={pool} setPool={setPool} mixingFees={mixingFees}/>
                                :
                                <Withdraw pool={pool} setPool={setPool}/>
                            }
                        </div>
                        <div className={styles.column}>
                            <PoolHistory/>
                            <PoolStats/>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}