export function reduceWalletAddress(address: string) {
    const length = address.length;
    return address.slice(0, 5) + "..." + address.slice(length - 5, length);
}