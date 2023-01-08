import styles from "../styles/Home.module.css"
import toast from "react-hot-toast";

export default function Note(props: { txUrl: string, depositNote: string, handleClose: () => void }) {
    const downloadTxtFile = () => {
        const element = document.createElement("a");
        const file = new Blob([props.depositNote],
            {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = "deposit_note.txt";
        document.body.appendChild(element);
        element.click();
    }

    const copyToClipboard = () => {
        toast.success("Copied to clipboard");
        navigator.clipboard.writeText(props.depositNote).catch(error => console.log(error));
    }

    return (
        <div className={styles.container}>
            <h3>Successful deposit!</h3>
            <a href={props.txUrl} className={styles.link}>{props.txUrl}</a>
            <hr/>
            Please save the following deposit note preciously. You will never be able to recover it after closing this
            window.
            <p/>
            <input
                id={"depositNote"}
                className={styles.clickable}
                value={props.depositNote}
                onClick={copyToClipboard}
                readOnly={true}
            />
            <p/>
            <div className={"center"}>
                <button
                    onClick={() => {
                        downloadTxtFile();
                    }}
                    className={styles.action}
                >
                    Save as .txt
                </button>
            </div>
            <hr/>
            <p/>
            <div className={"center"}>
                <button
                    className={styles.action}
                    onClick={props.handleClose}
                >
                    I saved my deposit note
                </button>
            </div>
            <p/>
        </div>
    )
}