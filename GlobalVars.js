import { createGlobalState } from "react-hooks-global-state";

const {setGlobalState, useGlobalState} = createGlobalState({
    backgroundColor: '#1f2833',
    headerColor: '#07000f',
    wordColor: 'white',
    DarkMode: true,
    account: "None",
    usesEmail: false,
    accountShow: "N/A",
    authenticated: false
});

export {setGlobalState, useGlobalState};