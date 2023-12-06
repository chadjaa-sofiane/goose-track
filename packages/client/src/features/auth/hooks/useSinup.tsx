import { useEffect } from "react"
import { RegisterFields, registerSchema } from "@/api/authApi"
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks"
import { cleanRegisterResult, registerAsync } from "@/redux/authSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export const useSinup = () => {
    const dispatch = useAppDispatch()
    const registerResult = useAppSelector(state => state.auth.registerResult)

    const { register, handleSubmit, formState: { errors, touchedFields, isSubmitting }, setError } = useForm<RegisterFields>({
        resolver: zodResolver(registerSchema)
    })

    useEffect(() => {
        if (!registerResult) return

        if (registerResult?.errors) {
            // Update form errors when there are login errors
            for (const error in registerResult.errors) {
                setError(error as keyof RegisterFields, {
                    type: 'manual',
                    message: registerResult.errors[error as keyof RegisterFields]
                });
            }
        }

        return () => {
            // Clean up login result when the component is unmounted
            dispatch(cleanRegisterResult())
        }
    }, [dispatch, registerResult, setError])


    const onSubmit = async (data: RegisterFields) => {
        await dispatch(registerAsync({
            email: data.email,
            name: data.name,
            password: data.password
        }))
    }

    return {
        register, errors, touchedFields, isSubmitting, setError, onSubmit: handleSubmit(onSubmit)
    }
}