import './index.css'
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import {Toaster} from "react-hot-toast";
import {WalletContext} from "./tezos/WalletContext";
import {useState} from "react";
import {TezosToolkit} from "@taquito/taquito";
import {NetworkContext} from "./tezos/NetworkContext";
import {ThemeContext} from "./layout/ThemeContext";
import Theme from "./components/Theme";
import {Home} from "./layout/Home";
import {BeaconWallet} from "@taquito/beacon-wallet";
import {NetworkType} from "@airgap/beacon-sdk";

function App() {
    const mainnet = false;
    const [tezos, setTezos] = useState(new TezosToolkit(mainnet ? process.env.REACT_APP_MAINNET_URL as string : process.env.REACT_APP_TESTNET_URL as string));

    const defaultNetworkValues = {
        mainnet: mainnet,
        network: mainnet ? process.env.REACT_APP_MAINNET_URL as string : process.env.REACT_APP_TESTNET_URL as string,
    }

    const walletOptions = {
        name: "On-chain mixer",
        preferredNetwork: defaultNetworkValues.mainnet ? "mainnet" as NetworkType : "testnet" as NetworkType,
    }

    const [wallet, setWallet] = useState(new BeaconWallet(walletOptions));
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState(0);

    /*useEffect(() => {
        (async () => {
            if (wallet === null) {
                const _wallet = new (await import("@taquito/beacon-wallet")).BeaconWallet(walletOptions as any);
                setWallet(_wallet);
                tezos.setWalletProvider(_wallet);
            }
        })();
    }, [wallet, tezos, defaultNetworkValues.mainnet]);*/

    const defaultWalletValues = {
        tezos: tezos as TezosToolkit,
        wallet: wallet,
        setWallet: setWallet,
        setTezos,
        address,
        setAddress,
        balance,
        setBalance
    }

    const [dark, setDark] = useState(true);
    const defaultThemeValue = {
        dark: dark,
        setDark: setDark,
    }

    return <NetworkContext.Provider value={defaultNetworkValues}>
        <WalletContext.Provider value={defaultWalletValues}>
            <ThemeContext.Provider value={defaultThemeValue}>
                <Theme>
                    <Header/>
                    <Home/>
                    <Toaster/>
                    <Footer/>
                </Theme>
            </ThemeContext.Provider>
        </WalletContext.Provider>
    </NetworkContext.Provider>
}

export default App;
