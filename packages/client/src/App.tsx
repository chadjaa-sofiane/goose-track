import { Provider as ReduxProvide } from 'react-redux'
import Router from '@/pages'
import store from '@/redux/store'
import { ToastProvider } from '@/components/toast/toastProvider'

const App = () => {
    return (
        <ReduxProvide store={store}>
            <ToastProvider>
                <Router />
            </ToastProvider>
        </ReduxProvide>
    )
}

export default App
