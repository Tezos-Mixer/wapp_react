import styles from "../styles/Home.module.css";
import {useContext, useEffect, useState} from "react";
import {NetworkContext} from "../tezos/NetworkContext";

interface Stats {
    account_id: number;
    address: string;
    baker: string;
    call_stats: {
        deposit: number;
        withdraw: number;
    };
    code_hash: string;
    creator: string;
    features: string[];
    first_seen: number;
    first_seen_time: string;
    iface_hash: string;
    interfaces: any[];
    last_seen: number;
    last_seen_time: string;
    n_calls_failed: number;
    n_calls_in: number;
    n_calls_out: number;
    storage_burn: number;
    storage_hash: string;
    storage_paid: number;
    storage_size: number;
    total_fees_used: number;
}

const defaultStats: Stats = {
    account_id: 0,
    address: '',
    baker: '',
    call_stats: {
        deposit: 0,
        withdraw: 0,
    },
    code_hash: '',
    creator: '',
    features: [],
    first_seen: 0,
    first_seen_time: '',
    iface_hash: '',
    interfaces: [],
    last_seen: 0,
    last_seen_time: '',
    n_calls_failed: 0,
    n_calls_in: 0,
    n_calls_out: 0,
    storage_burn: 0,
    storage_hash: '',
    storage_paid: 0,
    storage_size: 0,
    total_fees_used: 0,
};

export function PoolStats() {
    const contractAddress = process.env.REACT_APP_10_XTZ_POOL_CONTRACT_ADDRESS;
    const {mainnet} = useContext(NetworkContext);

    const url = `https://api.${!mainnet && "ghost."}tzstats.com/explorer/contract/${contractAddress}`;
    const [stats, setStats] = useState<Stats>(defaultStats);
    const [statsLoaded, setStatsLoaded] = useState(false);

    useEffect(() => {
        if (!statsLoaded) {
            fetch(url)
                .then(response => response.json())
                .then(stats => {
                    setStats(stats);
                });
            setStatsLoaded(true);
        }
    }, [url, statsLoaded]);

    return (
        <div className={styles.card}>
            <div className={styles.center}><h3>Pool stats</h3></div>
            <hr/>
            <p><b>Deposits: </b>{stats.call_stats.deposit}</p>
            <p><b>Withdraws: </b>{stats.call_stats.withdraw}</p>
        </div>
    )
}