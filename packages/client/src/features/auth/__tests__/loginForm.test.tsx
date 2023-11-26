import { it, describe, expect, vi } from "vitest"
import { screen } from "@testing-library/react";
import LoginForm from "../loginForm";
import { MemoryRouter } from "react-router-dom"
import { setup } from "@/setupTests";
import { login as ApiLogin } from "@/api/authApi";

describe("login", () => {
    it("should render the login form with all input fields and buttons", () => {
        const login = vi.fn()
        setup(
            <MemoryRouter>
                <LoginForm login={login} />
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
        const login = vi.fn()
        const { user } = setup(
            <MemoryRouter>
                <LoginForm login={login} />
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

        expect(login).toHaveBeenCalledTimes(0)
    })
    it("should handle API errors gracefully", async () => {
        const login = vi.fn().mockImplementation(ApiLogin)
        login.mockResolvedValue({
            data: null,
            errors: {
                email: "User doesn't exist",
                password: "Invalid email or password"
            }
        })
        const { user } = setup(
            <MemoryRouter>
                <LoginForm login={login} />
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

        const emailError = screen.getByTestId("error-message-email");
        const passwordError = screen.getByTestId("error-message-password");

        expect(login).toHaveBeenCalledOnce()
        expect(login).toBeCalledWith({
            email: inputs.email,
            password: inputs.password
        })
        expect(emailError).toBeInTheDocument()
        expect(emailError).toHaveTextContent("User doesn't exist")
        expect(passwordError).toBeInTheDocument()
        expect(passwordError).toHaveTextContent("Invalid email or password")
    })
})