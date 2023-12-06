import { useEffect } from "react"
import { LoginFields, loginSchema } from "@/api/authApi"
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks"
import { cleanLoginResult, loginAsync } from "@/redux/authSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export const useLogin = () => {
    const dispatch = useAppDispatch()
    const loginResult = useAppSelector(state => state.auth.loginResult)
    const { register, handleSubmit, formState: { errors, touchedFields, isSubmitting }, setError } = useForm<LoginFields>({
        resolver: zodResolver(loginSchema)
    })


    useEffect(() => {
        if (!loginResult) return

        if (loginResult?.errors) {
            // Update form errors when there are login errors
            for (const error in loginResult.errors) {
                setError(error as keyof LoginFields, {
                    type: 'manual',
                    message: loginResult.errors[error as keyof LoginFields]
                });
            }
            return;
        }
        return () => {
            // Clean up login result when the component is unmounted
            dispatch(cleanLoginResult())
        }
    }, [dispatch, loginResult, setError])


    const onSubmit = async (data: LoginFields) => {
        await dispatch(loginAsync({
            email: data.email,
            password: data.password
        }))
    }

    return {
        register, errors, touchedFields, isSubmitting, setError, onSubmit: handleSubmit(onSubmit)
    }
}