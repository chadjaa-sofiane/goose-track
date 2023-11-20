import { InputField } from "@/components/inputField"
import AuthLayout, { AuthForm } from "./authLayout"
import { Button } from "@/components/button"
import DoorIcon from "@/assets/exit.svg?react"
import RegisterWelcomeSrc from "./assets/welcome-register.png"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"

const SignUpForm = () => {
    const { register, handleSubmit } = useForm()

    const onSubmit = (data: unknown) => {
        console.log(data);
    }

    return <AuthLayout>
        <div className="flex flex-col gap-y-6 items-center">
            <AuthForm onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-accents-1 text-2xl"> Sign up </h1>
                <div className="flex flex-col gap-y-[1.25em]">
                    <InputField label="name" {...register("name")} />
                    <InputField label="email" {...register("email")} />
                    <InputField label="password" {...register("password")} />
                </div>
                <Button
                    className="flex justify-center"
                    type="submit"
                    icons={{
                        end: <DoorIcon className="stroke-white" />
                    }}>Log in</Button>
            </AuthForm>
            <div className="absolute hidden left-[5%] bottom-0 xl:left-[15%] xl:grid place-items-center -z-10">
                <img src={RegisterWelcomeSrc} alt="Quickly come in and write down your tasks for the day!" />
            </div>
            <Link to='/auth/login'>
                <span className="text-accents-1 underline text-[1.25rem]">Log in</span>
            </Link>
        </div>
    </AuthLayout >
}


export default SignUpForm