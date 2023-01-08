import styles from "../styles/Switch.module.css";

export default function Switch(props: { isOn: boolean, handleToggle: () => void, colorOne: string, colorTwo: string }) {
    return (
        <>
            <input
                checked={props.isOn}
                onChange={props.handleToggle}
                className={styles.checkbox}
                id={`switch`}
                type="checkbox"
            />
            <label
                style={{background: props.isOn ? props.colorTwo : props.colorOne}}
                className={styles.label}
                htmlFor={`switch`}
            >
                <span
                    className={styles.button}
                />
            </label>
        </>
    )
}