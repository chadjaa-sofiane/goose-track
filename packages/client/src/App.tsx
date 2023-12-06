import { Provider as ReduxProvide } from "react-redux"
import Router from "@/pages"
import store from "@/redux/store"

const App = () => {
    return (
        <ReduxProvide store={store}>
            <Router />
        </ReduxProvide>
    )
}

export default App
