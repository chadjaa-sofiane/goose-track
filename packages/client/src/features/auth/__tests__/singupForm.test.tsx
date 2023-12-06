import { it, describe, expect, beforeAll, afterEach, afterAll } from "vitest";
import { screen } from "@testing-library/react";
import SignUpForm from "../signupForm";
import { MemoryRouter } from "react-router-dom";
import { setupWithStore } from "@/setupTests";
import { setupServer } from "msw/node";
import { HttpResponse, delay, http } from "msw";


const handlers = [
    http.post('/auth/register', async () => {
        await delay(400)
        return HttpResponse.json({
            data: null,
            errors: {
                name: "name already exists !",
                email: "email already exists !"
            }
        }, { status: 400 })
    })
]

const server = setupServer(...handlers)

describe("SignUpForm", () => {

    beforeAll(() => server.listen())

    // Reset any runtime request handlers we may add during the tests.
    afterEach(() => server.resetHandlers())

    // Disable API mocking after the tests are done.
    afterAll(() => server.close())


    it("should render the signup form with all input fields and buttons", () => {
        setupWithStore(
            <MemoryRouter>
                <SignUpForm />
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

        const { user } = setupWithStore(
            <MemoryRouter>
                <SignUpForm />
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

    it("should have loading while the input is checking", async () => {
        const { user } = setupWithStore(
            <MemoryRouter>
                <SignUpForm />
            </MemoryRouter>
        )
        const inputs = {
            name: "Jhon Doe",
            email: "john@example.com",
            password: "StrongPassword123&"
        }

        const nameInput = screen.getByLabelText("name") as HTMLInputElement;
        await user.type(nameInput, inputs.name);

        const emailInput = screen.getByLabelText("email") as HTMLInputElement;
        await user.type(emailInput, inputs.email)

        const passwordInput = screen.getByLabelText("password") as HTMLInputElement;
        await user.type(passwordInput, inputs.password)

        const button = screen.getByRole("button", { name: "Sign up" })
        await user.click(button)

        expect(button).toHaveTextContent("loading...")
        expect(button).toBeDisabled()
    })

    it("should call the register function with valid user input", async () => {

        const { user } = setupWithStore(
            <MemoryRouter>
                <SignUpForm />
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

        const nameError = await screen.findByTestId("error-message-name");
        const emailError = await screen.findByTestId("error-message-email");

        expect(nameError).toBeInTheDocument()
        expect(nameError).toHaveTextContent("name already exists !")

        expect(emailError).toBeInTheDocument()
        expect(emailError).toHaveTextContent("email already exists !")
    });
});
