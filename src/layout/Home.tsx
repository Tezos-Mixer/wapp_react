import React, {useState} from 'react';
import styles from "../styles/Home.module.css";
import Deposit from "../mixer/Deposit";
import PoolHistory from "../mixer/PoolHistory";
import Withdraw from "../mixer/Withdraw";
import {PoolStats} from "../mixer/PoolStats";
import Pools from "../mixer/Pools";

export function Home() {
    const [selected, setSelected] = useState("deposit");
    const [pool, setPool] = useState(1);
    const mixingFees = 0.1;

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.center}>
                    <div className={styles.flex}>
                        <div className={styles.column}>
                            <div className={styles.card}>
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
                                <hr/>
                                <p/>
                                <Pools pool={pool} setPool={setPool}/>
                                <hr/>
                                {selected === "deposit" ?
                                    <Deposit pool={pool} setPool={setPool} mixingFees={mixingFees}/>
                                    :
                                    <Withdraw pool={pool} setPool={setPool}/>
                                }
                            </div>
                        </div>
                        <div className={styles.column}>
                            <PoolHistory selected={selected}/>
                            <PoolStats/>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}