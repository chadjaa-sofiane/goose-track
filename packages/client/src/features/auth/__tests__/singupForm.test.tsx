import { it, describe, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import SignUpForm from "../signupForm";
import { MemoryRouter } from "react-router-dom";
import { setup } from "@/setupTests";
import { register as ApiRegister } from "@/api/authApi";

describe("SignUpForm", () => {
    it("should render the signup form with all input fields and buttons", () => {
        const register = vi.fn();
        setup(
            <MemoryRouter>
                <SignUpForm signUp={register} />
            </MemoryRouter>
        );

        const nameInput = screen.getByLabelText("name");
        expect(nameInput).toBeInTheDocument();

        const emailInput = screen.getByLabelText("email");
        expect(emailInput).toBeInTheDocument();

        const passwordInput = screen.getByLabelText("password");
        expect(passwordInput).toBeInTheDocument();

        const submitButton = screen.getByRole("button", { name: "Sign up" });
        expect(submitButton).toBeInTheDocument();
    });

    it("should display error messages when user provides invalid input", async () => {
        const register = vi.fn();
        const { user } = setup(
            <MemoryRouter>
                <SignUpForm signUp={register} />
            </MemoryRouter>
        );
        const nameInput = screen.getByLabelText("name") as HTMLInputElement;
        await user.type(nameInput, "na");

        const emailInput = screen.getByLabelText("email") as HTMLInputElement;
        await user.type(emailInput, "invalidEmail");

        const passwordInput = screen.getByLabelText("password") as HTMLInputElement;


        const button = screen.getByRole("button", { name: "Sign up" });
        await user.click(button);

        const nameError = screen.getByTestId("error-message-name");
        expect(nameError).toBeInTheDocument();

        const emailError = screen.getByTestId("error-message-email");
        expect(emailError).toBeInTheDocument();
        expect(emailError).toHaveTextContent("please provide a valid email address");

        const passwords = [
            {
                password: "short",
                message: "Password must be at least 8 characters long"
            },
            {
                password: "long".repeat(10),
                message: 'Password must be no more than 32 characters long'
            },
            {
                password: "<password>",
                message: "Password must contain at least one uppercase letter"
            },
            {
                password: "<PASSWORD>",
                message: "Password must contain at least one lowercase letter"
            },
            {
                password: "<passWORD>",
                message: "Password must contain at least one number"
            },
            {
                password: "1passWORD1",
                message: "Password must contain at least one special character"
            }
        ]
        for (const password of passwords) {
            await user.clear(passwordInput)
            await user.type(passwordInput, password.password);
            await user.click(button);
            const passwordError = screen.getByTestId("error-message-password");
            expect(passwordError).toBeInTheDocument();
            expect(passwordError).toHaveTextContent(password.message);
        }
    });

    it("should call the register function with valid user input", async () => {
        const register = vi.fn().mockImplementation(ApiRegister);
        register.mockResolvedValue({
            data: null,
            errors: {
                name: "name already exists !",
                email: "email already exists !"
            }
        })

        const { user } = setup(
            <MemoryRouter>
                <SignUpForm signUp={register} />
            </MemoryRouter>
        );

        const inputs = {
            name: "Jhon Doe",
            email: "john@example.com",
            password: "StrongPassword123&"
        }

        const nameInput = screen.getByLabelText("name") as HTMLInputElement;
        await user.type(nameInput, inputs.name);

        const emailInput = screen.getByLabelText("email") as HTMLInputElement;
        await user.type(emailInput, inputs.email);

        const passwordInput = screen.getByLabelText("password") as HTMLInputElement;
        await user.type(passwordInput, inputs.password);

        const button = screen.getByRole("button", { name: "Sign up" });
        await user.click(button);

        const nameError = screen.getByTestId("error-message-name");
        const emailError = screen.getByTestId("error-message-email");

        expect(register).toHaveBeenCalledOnce();
        expect(register).toHaveBeenCalledWith({
            name: inputs.name,
            email: inputs.email,
            password: inputs.password,
        });
        expect(nameError).toBeInTheDocument()
        expect(nameError).toHaveTextContent("name already exists !")

        expect(emailError).toBeInTheDocument()
        expect(emailError).toHaveTextContent("email already exists !")
    });
});
