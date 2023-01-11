import styles from "../styles/Header.module.css";
import WalletButton from "../components/WalletButton";

export default function Header() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>Angela.cash</div>
            <div className={styles.flex}>
                <WalletButton/>
            </div>
        </div>
    )
}