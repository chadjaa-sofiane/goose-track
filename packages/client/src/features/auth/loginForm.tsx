import { InputField } from "@/components/inputField"
import AuthLayout, { AuthForm, Spinner } from "./authUi"
import { Button } from "@/components/button"
import DoorIcon from "@/assets/exit.svg?react"
import LoginWelcomeSrc from "./assets/welcome-login.png"
import { Link } from "react-router-dom"
import { useLogin } from "./hooks/useLogin"

const LoginForm = () => {
    const { register, errors, touchedFields, isSubmitting, onSubmit } = useLogin()
    return <AuthLayout>
        <div className="flex flex-col gap-y-6 items-center">
            <AuthForm onSubmit={onSubmit} error={Object.keys(errors).length > 0}>
                <h1 className="text-accents-1 text-2xl"> Log In </h1>
                <div className="flex flex-col gap-y-[1.25em]">
                    <InputField
                        label="email"
                        status={errors["email"] ? "error" : (touchedFields["email"] ? "done" : "normal")}
                        message={errors["email"] ? errors["email"]?.message : ''}
                        placeHolder="enter your email"
                        {...register("email")}
                    />
                    <InputField
                        // fill the rest here 
                        label="password"
                        className=""
                        status={errors["password"] ? "error" : (touchedFields["password"] ? "done" : "normal")}
                        message={errors["password"] ? errors["password"]?.message : ''}
                        placeHolder="enter your password"
                        {...register("password")}
                        type="password"
                    />
                </div>
                <Button
                    className="flex justify-center"
                    type="submit"
                    icons={{
                        end: isSubmitting ? <Spinner /> : <DoorIcon className="stroke-white" />
                    }}
                >Log in</Button>
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