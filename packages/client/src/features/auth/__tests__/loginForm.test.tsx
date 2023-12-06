import { it, describe, expect, afterAll, beforeAll, afterEach } from "vitest"
import { delay, http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { screen } from "@testing-library/react";
import LoginForm from "../loginForm";
import { MemoryRouter } from "react-router-dom"
import { setupWithStore } from "@/setupTests";

const handlers = [
    http.post('/auth/login', async () => {
        await delay(400)
        return HttpResponse.json({
            data: null,
            errors: {
                email: "User doesn't exist",
                password: "Invalid email or password"
            }
        }, { status: 400 })
    })
]

const server = setupServer(...handlers)

describe("login", () => {

    beforeAll(() => server.listen())

    // Reset any runtime request handlers we may add during the tests.
    afterEach(() => server.resetHandlers())

    // Disable API mocking after the tests are done.
    afterAll(() => server.close())

    it("should render the login form with all input fields and buttons", () => {

        setupWithStore(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );
        const emailInput = screen.getByLabelText("email");
        expect(emailInput).toBeInTheDocument()

        const passwordInput = screen.getByLabelText("password");
        expect(passwordInput).toBeInTheDocument()

        const submitButton = screen.getByRole("button", { name: "Log in" });
        expect(submitButton).toBeInTheDocument()
    });

    it("should display error messages when email and password are invalid", async () => {
        const { user } = setupWithStore(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        )
        const emailInput = screen.getByLabelText("email") as HTMLInputElement;
        await user.type(emailInput, "invalid")

        const passwordInput = screen.getByLabelText("password") as HTMLInputElement;

        const button = screen.getByRole("button", { name: "Log in" })

        await user.click(button)
        const emailError = screen.getByTestId("error-message-email");
        expect(emailError).toBeInTheDocument()
        expect(emailError).toHaveTextContent("please provide a valid email address")


        const passwords = [
            {
                password: "short",
                message: "Password must be at least 8 characters long"
            },
            {
                password: "long".repeat(10),
                message: 'Password must be no more than 32 characters long'
            }

        ]
        for (const password of passwords) {
            await user.clear(passwordInput)
            await user.type(passwordInput, password.password)

            await user.click(button)
            const passwordError = screen.getByTestId("error-message-password")

            expect(passwordError).toBeInTheDocument()
            expect(passwordError).toHaveTextContent(password.message)
        }
    })

    it("should have loading while the input is checking", async () => {
        const { user } = setupWithStore(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        )
        const inputs = {
            email: "unExistedEmail@gmail.com",
            password: "valid_password_120_AB_&$"
        }
        const emailInput = screen.getByLabelText("email") as HTMLInputElement;
        await user.type(emailInput, inputs.email)

        const passwordInput = screen.getByLabelText("password") as HTMLInputElement;
        await user.type(passwordInput, inputs.password)

        const button = screen.getByRole("button", { name: "Log in" })
        await user.click(button)

        expect(button).toHaveTextContent("loading...")
        expect(button).toBeDisabled()
    })

    it("should handle API errors gracefully", async () => {

        const { user } = setupWithStore(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        )
        const inputs = {
            email: "unExistedEmail@gmail.com",
            password: "valid_password_120_AB_&$"
        }

        const emailInput = screen.getByLabelText("email") as HTMLInputElement;
        await user.type(emailInput, inputs.email)

        const passwordInput = screen.getByLabelText("password") as HTMLInputElement;
        await user.type(passwordInput, inputs.password)
        
        const button = screen.getByRole("button", { name: "Log in" })
        await user.click(button)

        const emailError = await screen.findByTestId("error-message-email");
        const passwordError = await screen.findByTestId("error-message-password");

        expect(emailError).toBeInTheDocument()
        expect(emailError).toHaveTextContent("User doesn't exist")
        expect(passwordError).toBeInTheDocument()
        expect(passwordError).toHaveTextContent("Invalid email or password")
    })
})