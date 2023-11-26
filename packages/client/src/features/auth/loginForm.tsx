import { InputField } from "@/components/inputField"
import AuthLayout, { AuthForm } from "./authUi"
import { Button } from "@/components/button"
import DoorIcon from "@/assets/exit.svg?react"
import LoginWelcomeSrc from "./assets/welcome-login.png"
import { Link } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type Login, type LoginFields, loginSchema } from "@/api/authApi"

interface LoginFormProps {
    login: Login
}

const LoginForm = ({ login }: LoginFormProps) => {
    const { register, handleSubmit, formState: { errors, touchedFields }, setError } = useForm<LoginFields>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginFields) => {
        const result = await login({
            email: data.email,
            password: data.password
        })
        if (!result) {
            return
        }
        if (result.errors) {
            for (const error in result.errors) {
                setError(error as keyof LoginFields, {
                    type: "manual",
                    message: result.errors[error as keyof LoginFields]
                })
            }
            return
        }
        alert("you logged in successfully")
    }

    const showEmailErorr = errors["email"] && touchedFields["email"]
    const showPasswordErorr = errors["password"] && touchedFields["password"]
    return <AuthLayout>
        <div className="flex flex-col gap-y-6 items-center">
            <AuthForm onSubmit={handleSubmit(onSubmit)} error={Object.keys(errors).length > 0}>
                <h1 className="text-accents-1 text-2xl"> Log In </h1>
                <div className="flex flex-col gap-y-[1.25em]">
                    <InputField
                        label="email"
                        status={showEmailErorr ? "error" : (touchedFields["email"] ? "done" : "normal")}
                        message={showEmailErorr ? errors["email"]?.message : ""}
                        placeHolder="enter your email"
                        {...register("email")}
                    />
                    <InputField
                        // fill the rest here 
                        label="password"
                        className=""
                        status={showPasswordErorr ? "error" : (touchedFields["password"] ? "done" : "normal")}
                        message={showPasswordErorr ? errors["password"]?.message : ""}
                        placeHolder="enter your password"
                        {...register("password")}
                        type="password"
                    />
                </div>
                <Button
                    className="flex justify-center"
                    type="submit"
                    icons={{
                        end: <DoorIcon className="stroke-white" />
                    }}>Log in</Button>
            </AuthForm>
            <div className="absolute hidden right-[5%] bottom-[15%] xl:right-[15%] xl:grid place-items-center -z-10">
                <img src={LoginWelcomeSrc} alt="Quickly come in and write down your tasks for the day!" />
            </div>
            <Link to='/auth/signup'>
                <span className="text-accents-1 underline text-[1.25rem]">Sign up</span>
            </Link>
        </div>
    </AuthLayout >
}


export default LoginForm