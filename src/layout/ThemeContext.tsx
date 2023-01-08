import {createContext} from "react";

export const ThemeContext = createContext({
    dark: true,
    setDark: (dark: boolean) => {
        console.log(dark);
    },
})