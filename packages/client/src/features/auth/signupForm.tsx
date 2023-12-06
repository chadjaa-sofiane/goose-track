import { InputField } from "@/components/inputField"
import AuthLayout, { AuthForm, Spinner } from "./authUi"
import { Button } from "@/components/button"
import DoorIcon from "@/assets/exit.svg?react"
import RegisterWelcomeSrc from "./assets/welcome-register.png"
import { Link } from "react-router-dom"
import { useSinup } from "./hooks/useSinup"

const SignUpForm = () => {
    const { register, errors, touchedFields, isSubmitting, onSubmit } = useSinup()
    return <AuthLayout>
        <div className="flex flex-col gap-y-6 items-center">
            <AuthForm onSubmit={onSubmit} error={Object.keys(errors).length > 0}>
                <h1 className="text-accents-1 text-2xl"> Sign up </h1>
                <div className="flex flex-col gap-y-[1.25em]">
                    <InputField
                        label="name"
                        status={errors["name"] ? "error" : (touchedFields["name"] ? "done" : "normal")}
                        message={errors["name"] ? errors["name"]?.message : ''}
                        placeHolder="enter your name"
                        {...register("name")}
                    />
                    <InputField
                        label="email"
                        status={errors["email"] ? "error" : (touchedFields["email"] ? "done" : "normal")}
                        message={errors["email"] ? errors["email"]?.message : ""}
                        placeHolder="enter your email"
                        {...register("email")}
                    />
                    <InputField
                        label="password"
                        status={errors["password"] ? "error" : (touchedFields["password"] ? "done" : "normal")}
                        message={errors["password"] ? errors["password"]?.message : ""}
                        placeHolder="enter your password"
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