import { useEffect } from 'react'
import { LoginFields, loginSchema } from '@/api/authApi'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { cleanLoginResponse, loginAsync } from '@/redux/authSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { mapServerErrorsToForm } from '@/lib/utils'

export const useLogin = () => {
    const dispatch = useAppDispatch()

    const loginResponse = useAppSelector((state) => state.auth.loginResponse)

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields, isSubmitting },
        setError,
    } = useForm<LoginFields>({
        resolver: zodResolver(loginSchema),
    })

    useEffect(() => {
        if (!loginResponse) return

        if (loginResponse?.errors)
            mapServerErrorsToForm(setError, loginResponse?.errors)

        return () => {
            // Clean up login result when the component is unmounted
            dispatch(cleanLoginResponse())
        }
    }, [dispatch, loginResponse, setError])

    const onSubmit = async (data: LoginFields) => {
        await dispatch(
            loginAsync({
                email: data.email,
                password: data.password,
            })
        )
    }

    return {
        register,
        errors,
        touchedFields,
        isSubmitting,
        setError,
        onSubmit: handleSubmit(onSubmit),
    }
}
