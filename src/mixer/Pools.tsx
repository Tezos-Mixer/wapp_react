import styles from "../styles/Home.module.css";

export default function Pools(props: { pool: number, setPool: (pool: number) => void }) {
    return (
        <div className={styles.center}>
            <div className={styles.srow}>
                <div className={styles.column}>
                    <button
                        className={props.pool === 1 ? styles.selected : styles.unselected}
                        onClick={() => props.setPool(1)}
                        disabled={props.pool === 1}
                    >
                        1 ꜩ
                    </button>
                </div>
                <div className={styles.column}>
                    <button
                        className={props.pool === 10 ? styles.selected : styles.unselected}
                        onClick={() => props.setPool(10)}
                        disabled={props.pool === 10}
                    >
                        10 ꜩ
                    </button>
                </div>
                <div className={styles.column}>
                    <button
                        className={props.pool === 100 ? styles.selected : styles.unselected}
                        onClick={() => props.setPool(100)}
                        disabled={props.pool === 100}
                    >
                        100 ꜩ
                    </button>
                </div>
                <div className={styles.column}>
                    <button
                        className={props.pool === 1000 ? styles.selected : styles.unselected}
                        onClick={() => props.setPool(1000)}
                        disabled={props.pool === 1000}
                    >
                        1000 ꜩ
                    </button>
                </div>
            </div>
        </div>
    )
}