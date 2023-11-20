import { InputField } from "@/components/inputField"
import AuthLayout, { AuthForm } from "./authLayout"
import { useState } from "react"
import { Button } from "@/components/button"
import DoorIcon from "@/assets/exit.svg?react"
import LoginWelcomeSrc from "./assets/welcome-login.png"
import { Link } from "react-router-dom"

const LoginForm = () => {
    const [value, setValue] = useState("")

    return <AuthLayout>
        <div className="flex flex-col gap-y-6 items-center">
            <AuthForm>
                <h1 className="text-accents-1 text-2xl"> Log In </h1>
                <div className="flex flex-col gap-y-[1.25em]">
                    <InputField name="email" label="email" value={value} onChange={(e) => setValue(e.target.value)} placeHolder="" />
                    <InputField name="password" label="password" value={value} type="password" onChange={(e) => setValue(e.target.value)} />
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