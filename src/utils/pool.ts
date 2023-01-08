import {contractAddresses} from "./contracts";

export const getPoolAddress = (pool: number) => {
    let contractAddress;

    switch (pool) {
        case 1:
            contractAddress = contractAddresses.one;
            break;
        case 10:
            contractAddress = contractAddresses.ten;
            break;
        case 100:
            contractAddress = contractAddresses.hundred;
            break;
        case 1000:
            contractAddress = contractAddresses.thousand;
            break;
        default:
            console.log("The request pool does not exist.")
    }

    return contractAddress;
}