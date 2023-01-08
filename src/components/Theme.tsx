import {useContext} from "react";
import {ThemeContext} from "../layout/ThemeContext";

export default function Theme(props: any) {
    const {dark} = useContext(ThemeContext);

    return (
        <div className={dark ? "dark" : "light"}>
            {props.children}
        </div>
    )
}