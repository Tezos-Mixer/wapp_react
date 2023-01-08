import styles from "../styles/Loader.module.css";

export default function Loader(props: { show: boolean }) {
    return props.show ? <div className={styles.loader}></div> : null;
}