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
    thousand: process.env.REACT_APP_10_XTZ_POOL_CONTRACT_ADDRESS as string,
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
