import { describe, it, expect, vi } from 'vitest'
import { setupWithStore } from '@/setupTests'
import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NavigationBar } from '.'
import { type Route } from '../../routes'

describe('navigationBar', () => {
    const routes: Route[] = [
        {
            path: 'test_1',
            title: 'test one',
            element: <> test one page </>,
            icon: <></>,
            pageTitle: 'page one',
        },
        {
            path: 'test_2',
            title: 'test two',
            element: <> test two page </>,
            icon: <></>,
            pageTitle: 'page two',
        },
        {
            path: 'test_3',
            title: 'test three',
            element: <> test three page</>,
            icon: <></>,
            pageTitle: 'page three',
        },
    ]

    it('render the navigation bar', async () => {
        const setOpen = vi.fn()
        setupWithStore(
            <MemoryRouter>
                <NavigationBar open={false} setOpen={setOpen} routes={[]} />
            </MemoryRouter>
        )

        const nav = screen.getByRole('navigation')
        expect(nav).toBeInTheDocument()
    })

    it('should render all the links inside the navigation bar', async () => {
        const setOpen = vi.fn()
        setupWithStore(
            <MemoryRouter>
                <NavigationBar open={false} setOpen={setOpen} routes={routes} />
            </MemoryRouter>
        )
        const links = screen.getAllByRole('listitem')
        expect(links.length).toBe(3)
    })
})
