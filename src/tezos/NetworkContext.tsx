import {createContext} from "react";

export const NetworkContext = createContext({
    mainnet: false,
    network: "",
})