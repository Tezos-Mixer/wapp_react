import styles from "../styles/Modal.module.css";

export default function Modal(props: { content: JSX.Element, show: boolean, handleClose: () => void }) {
    return (
        <div className={props.show ? styles.show : styles.hide}>
            <div className={props.show ? styles.background : undefined}/>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <div className={styles.body}>
                    {props.content}
                </div>
            </div>
        </div>
    )
}