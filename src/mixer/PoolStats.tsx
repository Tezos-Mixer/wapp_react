import styles from "../styles/Home.module.css";
import {useContext, useEffect, useState} from "react";
import {NetworkContext} from "../tezos/NetworkContext";

interface ContractStats {
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

interface AccountStats {
    row_id: number;
    address: string;
    address_type: string;
    pubkey: string;
    counter: number;
    first_in: number;
    first_out: number;
    last_in: number;
    last_out: number;
    first_seen: number;
    last_seen: number;
    first_in_time: string;
    first_out_time: string;
    last_in_time: string;
    last_out_time: string;
    first_seen_time: string;
    last_seen_time: string;
    total_received: number;
    total_sent: number;
    total_burned: number;
    total_fees_paid: number;
    total_fees_used: number;
    spendable_balance: number;
    is_funded: boolean;
    is_activated: boolean;
    is_delegated: boolean;
    is_revealed: boolean;
    is_baker: boolean;
    is_contract: boolean;
    n_tx_success: number;
    n_tx_failed: number;
    n_tx_out: number;
    n_tx_in: number;
    frozen_bond: number;
    lost_bond: number;
    metadata: {
        [key: string]: {
            address: string;
            alias: {
                name: string;
                kind: string;
                logo: string;
            };
            location: {
                country: string;
            };
            social: {
                twitter: string;
            };
        };
    };
}

const defaultContractStats: ContractStats = {
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

const defaultAccountStats: AccountStats = {
    row_id: 0,
    address: '',
    address_type: '',
    pubkey: '',
    counter: 0,
    first_in: 0,
    first_out: 0,
    last_in: 0,
    last_out: 0,
    first_seen: 0,
    last_seen: 0,
    first_in_time: '',
    first_out_time: '',
    last_in_time: '',
    last_out_time: '',
    first_seen_time: '',
    last_seen_time: '',
    total_received: 0,
    total_sent: 0,
    total_burned: 0,
    total_fees_paid: 0,
    total_fees_used: 0,
    spendable_balance: 0,
    is_funded: false,
    is_activated: false,
    is_delegated: false,
    is_revealed: false,
    is_baker: false,
    is_contract: false,
    n_tx_success: 0,
    n_tx_failed: 0,
    n_tx_out: 0,
    n_tx_in: 0,
    frozen_bond: 0,
    lost_bond: 0,
    metadata: {},
};

export function PoolStats() {
    const contractAddress = process.env.REACT_APP_10_XTZ_POOL_CONTRACT_ADDRESS;
    const {mainnet} = useContext(NetworkContext);

    const contractEndpointUrl = `https://api.${!mainnet && "ghost."}tzstats.com/explorer/contract/${contractAddress}`;
    const accountEndpointUrl = `https://api.${!mainnet && "ghost."}tzstats.com/explorer/account/${contractAddress}`;

    const [contractStats, setContractsStats] = useState<ContractStats>(defaultContractStats);
    const [contractStatsLoaded, setContractStatsLoaded] = useState(false);

    const [accountStats, setAccountStats] = useState<AccountStats>(defaultAccountStats);
    const [accountStatsLoaded, setAccountStatsLoaded] = useState(false);

    useEffect(() => {
        if (!contractStatsLoaded) {
            setContractStatsLoaded(true);

            fetch(contractEndpointUrl)
                .then(response => response.json())
                .then(stats => {
                    setContractsStats(stats);
                });
        }
    }, [contractEndpointUrl, contractStatsLoaded]);

    useEffect(() => {
        if (!accountStatsLoaded) {
            setAccountStatsLoaded(true);

            fetch(accountEndpointUrl)
                .then(response => response.json())
                .then(stats => {
                    setAccountStats(stats);
                });
        }
    }, [accountEndpointUrl, accountStatsLoaded]);

    return (
        <div className={styles.card}>
            <div className={styles.center}><h3>Pool stats</h3></div>
            <hr/>
            <p><b>Total balance: </b>{accountStats.spendable_balance} ꜩ</p>
            <p><b>Deposits: </b>{contractStats.call_stats.deposit}</p>
            <p><b>Withdraws: </b>{contractStats.call_stats.withdraw}</p>
        </div>
    )
}