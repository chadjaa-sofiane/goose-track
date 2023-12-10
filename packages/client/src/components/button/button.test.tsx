// button.test.js
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './button'

describe('button', () => {
    it('renders button with text', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('renders button with start icon', () => {
        const startIcon = <span data-testid="start-icon">👈</span>
        render(<Button icons={{ start: startIcon }}>Click me</Button>)
        expect(screen.getByTestId('start-icon')).toBeInTheDocument()
    })

    it('renders button with end icon', () => {
        const endIcon = <span data-testid="end-icon">👉</span>
        render(<Button icons={{ end: endIcon }}>Click me</Button>)
        expect(screen.getByTestId('end-icon')).toBeInTheDocument()
    })

    it('button is disabled when disabled prop is true', () => {
        render(<Button disabled={true}>Click me</Button>)
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('button is not disabled when disabled prop is false', () => {
        render(<Button disabled={false}>Click me</Button>)
        expect(screen.getByRole('button')).not.toBeDisabled()
    })

    it('button has additional class when className prop is provided', () => {
        render(<Button className="custom-class">Click me</Button>)
        expect(screen.getByRole('button')).toHaveClass('custom-class')
    })

    it('button has hover styles when not disabled and hovered', () => {
        render(<Button>Click me</Button>)
        const button = screen.getByRole('button')
        userEvent.hover(button)
        expect(button).toHaveClass('hover:bg-accents-2 hover:shadow-button')
    })

    it('button does not have hover styles when disabled and hovered', () => {
        render(<Button disabled>Click me</Button>)
        const button = screen.getByRole('button')
        userEvent.hover(button)
        expect(button).not.toHaveClass('hover:bg-accents-2 hover:shadow-button')
    })
})
