import React, {useContext, useEffect, useState} from 'react';
import styles from "../styles/Home.module.css";
import Deposit from "../mixer/Deposit";
import PoolHistory from "../mixer/PoolHistory";
import Withdraw from "../mixer/Withdraw";
import {PoolStats} from "../mixer/PoolStats";
import Pools from "../mixer/Pools";
import {getPoolAddress} from "../utils/pool";
import {AccountStats, ContractStats, defaultAccountStats, defaultContractStats, Transaction} from "../utils/contracts";
import {NetworkContext} from "../tezos/NetworkContext";
import Note from "../mixer/Note";
import Modal from "../components/Modal";
import "./holo.png";
import "./holo2.png";

export function Home() {
    const [showModal, setShowModal] = useState(false);
    const [txUrl, setTxUrl] = useState("");
    const [depositNote, setDepositNote] = useState("");

    const [selected, setSelected] = useState("deposit");
    const [pool, setPool] = useState(1);
    const mixingFees = 0;
    const {mainnet} = useContext(NetworkContext);

    const [contractAddress, setContractAddress] = useState(getPoolAddress(pool));

    const [contractEndpointUrl, setContractEndpointUrl] = useState(`https://api.${!mainnet && "ghost."}tzstats.com/explorer/contract/${contractAddress}`);
    const [contractStats, setContractStats] = useState<ContractStats>(defaultContractStats);
    const [contractStatsLoaded, setContractStatsLoaded] = useState(false);

    const [accountEndpointUrl, setAccountEndpointUrl] = useState(`https://api.${!mainnet && "ghost."}tzstats.com/explorer/account/${contractAddress}`);
    const [accountStats, setAccountStats] = useState<AccountStats>(defaultAccountStats);
    const [accountStatsLoaded, setAccountStatsLoaded] = useState(false);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionsLoaded, setTransactionsLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            const poolAddress = await getPoolAddress(pool);

            setContractAddress(poolAddress);

            setContractEndpointUrl(`https://api.${!mainnet && "ghost."}tzstats.com/explorer/contract/${poolAddress}`);
            setAccountEndpointUrl(`https://api.${!mainnet && "ghost."}tzstats.com/explorer/account/${poolAddress}`);

            setContractStatsLoaded(false);
            setAccountStatsLoaded(false);
            setTransactionsLoaded(false);
        })()
    }, [pool, mainnet]);

    useEffect(() => {
        if (!accountStatsLoaded) {
            setAccountStatsLoaded(true);

            fetch(accountEndpointUrl)
                .then(response => response.json())
                .then((stats: any) => {
                    setAccountStats(stats);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [accountEndpointUrl, accountStatsLoaded]);

    useEffect(() => {
        if (!contractStatsLoaded) {
            setContractStatsLoaded(true);

            fetch(contractEndpointUrl)
                .then(response => response.json())
                .then((stats: any) => {
                    setContractStats(stats);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [contractEndpointUrl, contractStatsLoaded]);

    useEffect(() => {
        if (!transactionsLoaded) {
            (async () => {
                await fetch(contractEndpointUrl + "/calls")
                    .then(response => response.json())
                    .then((calls: Transaction[]) => {
                        return calls.length > 0 ? calls
                            .filter((call: Transaction) => call.type === "transaction")
                            .sort((a, b) => b.id - a.id) : []
                    })
                    .then((transactions: Transaction[]) => {
                        const array: Transaction[] = [];
                        transactions.forEach((transaction: Transaction) => {
                            array.push(transaction);
                        })
                        setTransactions(array);
                    })
                    .catch((error) => console.log(error))
            })()

            setTransactionsLoaded(true);
        }
    }, [contractEndpointUrl, transactionsLoaded, selected]);

    return (
        <div className={styles.container}>
            <div className={styles.holo1}>
                <img src={holo} alt={"holographic 3D blob"} width={600} height={300}/>
            </div>
            <div className={styles.holo2}>
                <img src={holo2} alt={"holographic 3D blob"} width={600} height={300}/>
            </div>
            <Modal content={
                <Note txUrl={txUrl} depositNote={depositNote} handleClose={() => setShowModal(false)}/>}
                   show={showModal}
                   handleClose={() => setShowModal(false)}
            />
            <main className={styles.main}>
                <div className={styles.row}>
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
                                <Deposit pool={pool} setPool={setPool} mixingFees={mixingFees}
                                         setShowModal={setShowModal} setTxUrl={setTxUrl}
                                         setDepositNote={setDepositNote}/>
                                :
                                <Withdraw pool={pool} setPool={setPool}/>
                            }
                        </div>
                    </div>
                    <div className={styles.column}>
                        <PoolHistory selected={selected} transactions={transactions}
                                     transactionsLoaded={transactionsLoaded}/>
                    </div>
                </div>
                <p/>
                <PoolStats contractStats={contractStats.account_id ? contractStats : defaultContractStats}
                           accountStats={accountStats.spendable_balance ? accountStats : defaultAccountStats}/>
            </main>
        </div>
    );
}