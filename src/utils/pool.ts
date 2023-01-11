import {poolContractAddresses, treeContractAddresses} from "./contracts";

export const getPoolAddress = (pool: number) => {
    let contractAddress;

    switch (pool) {
        case 1:
            contractAddress = poolContractAddresses.one;
            break;
        case 10:
            contractAddress = poolContractAddresses.ten;
            break;
        case 100:
            contractAddress = poolContractAddresses.hundred;
            break;
        case 1000:
            contractAddress = poolContractAddresses.thousand;
            break;
        default:
            contractAddress = ""
            console.log("The requested pool contract does not exist.")
            break;
    }

    return contractAddress;
}

export const getTreeAddress = (pool: number) => {
    let contractAddress;

    switch (pool) {
        case 1:
            contractAddress = treeContractAddresses.one;
            break;
        case 10:
            contractAddress = treeContractAddresses.ten;
            break;
        case 100:
            contractAddress = treeContractAddresses.hundred;
            break;
        case 1000:
            contractAddress = treeContractAddresses.thousand;
            break;
        default:
            contractAddress = ""
            console.log("The requested tree contract does not exist.")
            break;
    }

    return contractAddress;
}