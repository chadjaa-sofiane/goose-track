import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// setup userEvent
export const setup = (jsx: React.ReactElement) => {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    }
}
