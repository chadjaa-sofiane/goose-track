import { InputField } from "@/components/inputField"
import AuthLayout, { AuthForm, Spinner } from "./authUi"
import { Button } from "@/components/button"
import DoorIcon from "@/assets/exit.svg?react"
import RegisterWelcomeSrc from "./assets/welcome-register.png"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterFields, registerSchema, register as signUp } from "@/api/authApi"

const SignUpForm = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting, touchedFields }, setError } = useForm<RegisterFields>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur"
    })

    const onSubmit = async (data: RegisterFields) => {
        const result = await signUp({
            email: data.email,
            password: data.password,
            name: data.name
        })
        if (!result) return
        if (result.errors) {
            for (const error in result.errors) {
                setError(error as keyof RegisterFields, {
                    type: "manual",
                    message: result.errors[error as keyof RegisterFields]
                })
            }
            return
        }
        alert("you registered successfully")
    }
    return <AuthLayout>
        <div className="flex flex-col gap-y-6 items-center">
            <AuthForm onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-accents-1 text-2xl"> Sign up </h1>
                <div className="flex flex-col gap-y-[1.25em]">
                    <InputField
                        label="name"
                        status={errors["name"] ? "error" : (touchedFields["name"] ? "done" : "normal")}
                        message={errors["name"] ? errors["name"]?.message : ''}
                        {...register("name")}
                    />
                    <InputField
                        label="email"
                        status={errors["email"] ? "error" : (touchedFields["email"] ? "done" : "normal")}
                        message={errors["email"] ? errors["email"]?.message : ""}
                        {...register("email")}
                    />
                    <InputField
                        label="password"
                        status={errors["password"] ? "error" : (touchedFields["password"] ? "done" : "normal")}
                        message={errors["password"] ? errors["password"]?.message : ""}
                        {...register("password")}
                        type="password"
                    />
                </div>
                <Button
                    className="flex justify-center disabled:cursor-not-allowed disabled:bg-opacity-10 disabled:text-opacity-10"
                    type="submit"
                    disabled={isSubmitting}
                    icons={{
                        end: isSubmitting ? <Spinner /> : <DoorIcon className="stroke-white" />
                    }}>{isSubmitting ? "loading..." : "Sign up"}</Button>
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