import { useEffect } from 'react'
import { RegisterFields, registerSchema } from '@/api/authApi'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { cleanRegisterResponse, registerAsync } from '@/redux/authSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { mapServerErrorsToForm } from '@/lib/utils'

export const useSinup = () => {
    const dispatch = useAppDispatch()
    const registerResponse = useAppSelector(
        (state) => state.auth.registerResponse
    )

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields, isSubmitting },
        setError,
    } = useForm<RegisterFields>({
        resolver: zodResolver(registerSchema),
    })

    useEffect(() => {
        if (!registerResponse) return
        if (registerResponse?.errors)
            mapServerErrorsToForm(setError, registerResponse?.errors)

        return () => {
            // Clean up login result when the component is unmounted
            dispatch(cleanRegisterResponse())
        }
    }, [dispatch, registerResponse, setError])

    const onSubmit = async (data: RegisterFields) => {
        await dispatch(
            registerAsync({
                email: data.email,
                name: data.name,
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
