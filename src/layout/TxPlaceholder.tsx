import styles from "../styles/Home.module.css";

export default function TxPlaceholder() {
    return <div className={styles.transaction}>
                        <span className={styles.date}>
                            Loading...
                        </span>
        <b className={styles.muted}>Loading...</b>
    </div>
}