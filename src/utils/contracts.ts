import {ContractMethod, ContractProvider, TezosToolkit} from "@taquito/taquito";
import toast from "react-hot-toast";

interface ContractAddresses {
    one: string;
    ten: string;
    hundred: string;
    thousand: string;
}

export const contractAddresses: ContractAddresses = {
    one: process.env.REACT_APP_1_XTZ_POOL_CONTRACT_ADDRESS as string,
    ten: process.env.REACT_APP_10_XTZ_POOL_CONTRACT_ADDRESS as string,
    hundred: process.env.REACT_APP_100_XTZ_POOL_CONTRACT_ADDRESS as string,
    thousand: process.env.REACT_APP_1000_XTZ_POOL_CONTRACT_ADDRESS as string,
}

export interface ContractStats {
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

export interface AccountStats {
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

export const defaultContractStats: ContractStats = {
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

export const defaultAccountStats: AccountStats = {
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

export interface Transaction {
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

export async function loadContractEntryPoints(tezos: TezosToolkit, address: string) {
    let methods = null;

    tezos.contract
        .at(address)
        .then((c) => {
            methods = c.parameterSchema.ExtractSignatures();
            console.log(JSON.stringify(methods, null, 2));
        })
        .catch((error) => {
            toast.error(error)
        });

    return methods;
}

export function callEntryPoint(tezos: TezosToolkit, address: string, method: ContractMethod<ContractProvider>) {
    return tezos.contract
        .at(address)
        .then(() => {
            method.toTransferParams();
        })
        .then((op: any) => {
            console.log(`Waiting for ${op.hash} to be confirmed...`);
            return op.confirmation(3).then(() => op.hash);
        })
        .then((hash) => {
            toast.success(`Successful transaction: https://${process.env.REACT_APP_TESTNET_NAME?.toLowerCase()}.tzstats.com/${hash}`)
        })
        .catch((error) => {
            toast.error(error.toString())
        });
}
