import '@testing-library/jest-dom'
import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createStore } from './redux/store'
import { PropsWithChildren } from 'react'

// setup userEvent
export const setup = (jsx: React.ReactElement, renderOptions?: RenderOptions) => {
    return {
        user: userEvent.setup(),
        ...render(jsx, { ...renderOptions }),
    }
}


export const setupWithStore = (jsx: React.ReactElement, renderOptions?: RenderOptions) => {
    const store = createStore()
    const Wrapper = ({ children }: PropsWithChildren) => {
        return <Provider store={store}>{children}</Provider>
    }
    return {
        user: userEvent.setup(),
        store,
        ...render(jsx, { wrapper: Wrapper, ...renderOptions })
    }
}
