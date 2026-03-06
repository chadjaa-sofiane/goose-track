import { InputField } from '@/components/inputField'
import AuthLayout, { AuthForm, Spinner } from './authUi'
import { Button } from '@/components/button'
import DoorIcon from '@/assets/exit.svg?react'
import LoginWelcomeSrc from './assets/welcome-login.png'
import { Link } from 'react-router-dom'
import { useLogin } from './hooks/useLogin'

const LoginForm = () => {
    const { register, errors, touchedFields, isSubmitting, onSubmit } =
        useLogin()

    return (
        <AuthLayout>
            <div className="flex flex-col items-center gap-y-6 fade-in-up">
                <AuthForm
                    onSubmit={onSubmit}
                    error={Object.keys(errors).length > 0}
                >
                    <Link
                        to="/"
                        className="w-fit text-sm font-semibold text-accents-6 transition-colors duration-300 hover:text-accents-1"
                    >
                        ← Back to home
                    </Link>
                    <h1 className="text-2xl text-accents-6">Log In</h1>
                    <div className="flex flex-col gap-y-[1.25em]">
                        <InputField
                            label="email"
                            status={
                                errors.email
                                    ? 'error'
                                    : touchedFields.email
                                    ? 'done'
                                    : 'normal'
                            }
                            message={errors.email ? errors.email.message : ''}
                            placeHolder="enter your email"
                            {...register('email')}
                        />
                        <InputField
                            label="password"
                            status={
                                errors.password
                                    ? 'error'
                                    : touchedFields.password
                                    ? 'done'
                                    : 'normal'
                            }
                            message={
                                errors.password ? errors.password.message : ''
                            }
                            placeHolder="enter your password"
                            {...register('password')}
                            type="password"
                        />
                    </div>
                    <Button
                        className="flex justify-center transition-all duration-300"
                        type="submit"
                        disabled={isSubmitting}
                        icons={{
                            end: isSubmitting ? (
                                <Spinner />
                            ) : (
                                <DoorIcon className="stroke-white" />
                            ),
                        }}
                    >
                        {isSubmitting ? 'loading...' : 'Log in'}
                    </Button>
                </AuthForm>
                <div className="absolute bottom-[15%] right-[5%] -z-10 hidden place-items-center opacity-80 transition-opacity duration-300 xl:right-[15%] xl:grid">
                    <img
                        src={LoginWelcomeSrc}
                        alt="Quickly come in and write down your tasks for the day!"
                    />
                </div>
                <Link
                    to="/auth/signup"
                    className="text-[1.05rem] text-accents-6 underline transition-colors duration-300 hover:text-accents-1"
                >
                    Sign up
                </Link>
            </div>
        </AuthLayout>
    )
}

export default LoginForm
