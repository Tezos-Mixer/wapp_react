import styles from "../styles/Stats.module.css";

export default function Stats(props: { name: string, value: string | number }) {
    return <div className={styles.stats}>
        <div className={styles.center}>
            <span className={styles.muted}>{props.name}</span>
        </div>
        <p/>
        <div className={styles.center}>
            <h1 className={styles.figure}>{props.value}</h1>
        </div>
    </div>
}