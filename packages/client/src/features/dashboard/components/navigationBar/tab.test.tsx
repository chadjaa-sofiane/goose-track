import { setup } from "@/setupTests"
import { describe, expect, it, vi } from "vitest"
import Tab from "./tab"
import { screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"


describe("Tab", () => {
    it("should render with the currect props", () => {
        setup(
            <MemoryRouter>
                <Tab
                    href="test"
                    active={false}
                    text="test"
                    icon={<></>}
                />
            </MemoryRouter>
        )

        const linkElement = screen.getByRole("link") as HTMLLinkElement
        expect(linkElement).toBeInTheDocument()
        expect(linkElement).toHaveAttribute('href', "/test")
    })

    it("should redirect when clicked", async () => {
        const onClick = vi.fn()
        const { user } = setup(
            <MemoryRouter initialEntries={["/dashboard"]} initialIndex={0}>
                <Tab
                    href="test"
                    active={true}
                    text='test'
                    icon={<></>}
                    onClick={onClick}
                />
            </MemoryRouter>
        )
        const linkElement = screen.getByRole("link") as HTMLLinkElement
        await user.click(linkElement)
        expect(onClick).toBeCalledTimes(1)
        expect(linkElement).toHaveAttribute("aria-current", 'page')
    })
})