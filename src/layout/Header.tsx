import {useContext, useEffect, useState} from "react";
import styles from "../styles/Header.module.css";
import Switch from "../components/Switch";
import {ThemeContext} from "./ThemeContext";
import WalletButton from "../components/WalletButton";

export default function Header() {
    const [checked, setChecked] = useState(false);
    const {dark, setDark} = useContext(ThemeContext);
    const [storageLoaded, setStorageLoaded] = useState(false);

    useEffect(() => {
        if (!storageLoaded) {
            setStorageLoaded(true);
            const isDark = localStorage.getItem("dark") ? (localStorage.getItem("dark") === "true") : true;
            setDark(isDark);
            if (!isDark) {
                setChecked(true);
            }
        }
    }, [storageLoaded, dark, setDark])

    return (
        <div className={styles.container}>
            <div className={styles.title}>Angela.cash</div>
            <div className={styles.flex}>
                <Switch
                    isOn={checked}
                    handleToggle={() => {
                        setChecked(!checked);
                        const newDarkValue = !dark;
                        setDark(newDarkValue);
                        const isDark = newDarkValue ? "true" : "false";
                        localStorage.setItem("dark", isDark);
                    }}
                    colorOne="rgba(34,193,195,1)"
                    colorTwo="rgba(253,187,45,1)"
                />
                <WalletButton/>
            </div>
        </div>
    )
}