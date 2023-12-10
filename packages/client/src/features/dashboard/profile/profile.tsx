import { ProfileImageUploader } from '@/components/profileImageUploader'
import { DashboardPageLayout } from '../dashboardLayout'
import testSrc from '@/features/dashboard/assets/test.png'
import { InputField } from '@/components/inputField'
import { Button } from '@/components/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { updateUserDataAsync } from '@/redux/userSlice'
import { mapServerErrorsToForm } from '@/lib/utils'
import {
    type UpdateUserDataResponse,
    type UpdateUserFields,
    updateUserSchema,
} from '@/api/userApi'
import { removeFalsyFields } from 'server/src/lib/removeFalsyFields'

const Profile = () => {
    const fields = useAppSelector((select) => select.user.data)
    const dispatch = useAppDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields, isSubmitting },
        setError,
    } = useForm<UpdateUserFields>({
        resolver: zodResolver(updateUserSchema),
        mode: 'onSubmit',
        defaultValues: {
            name: fields?.name || '',
            email: fields?.email || '',
            phone: fields?.phone || '',
            birthday: fields?.birthday
                ? new Date(fields?.birthday).toISOString().slice(0, 10)
                : '',
        },
    })

    const onSubmit = async (data: UpdateUserFields) => {
        const result = await dispatch(
            updateUserDataAsync(removeFalsyFields(data))
        )
        const payload = result.payload as UpdateUserDataResponse
        if (payload?.errors) mapServerErrorsToForm(setError, payload?.errors)
        if (payload.success) {
            alert('user get updated successfuly!')
        }
    }

    const showButton = Object.keys(touchedFields).length === 0

    return (
        <DashboardPageLayout title="User Profile">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative flex-1 bg-red-500 mt-24 md:mt-0 flex flex-col gap-y-11 items-center dark:bg-accents-6 rounded-xl px-8 py-10 lg:py-[3.75em]"
            >
                <div className="flex flex-col items-center pt-20 md:pt-0">
                    <ProfileImageUploader
                        className="absolute md:relative top-0 left-1/2 -translate-x-1/2 -translate-y-1/4  md:translate-0 "
                        src={testSrc}
                    />
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-bold">Nadiia Doe</span>
                        <span className="font-semibold text-[#62636a]">
                            User
                        </span>
                    </div>
                </div>
                <div className="flex-1 w-full md:w-5/6 xl:w-3/4 flex flex-col gap-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[3.125em] gap-y-6">
                        <InputField
                            {...register('name')}
                            required={false}
                            status={errors['name'] && 'error'}
                            message={errors['name'] && errors['name']?.message}
                            label="user name"
                            placeHolder="add your name"
                        />
                        <InputField
                            {...register('phone')}
                            status={errors['phone'] && 'error'}
                            message={errors['phone'] && errors['phone'].message}
                            label="phone"
                            inputMode="numeric"
                            placeHolder="add your number"
                        />
                        <InputField
                            {...register('birthday')}
                            status={errors['birthday'] && 'error'}
                            message={
                                errors['birthday'] &&
                                errors['birthday']?.message
                            }
                            label="Birthday"
                            type="date"
                        />
                        <InputField
                            {...register('skype')}
                            status={errors['skype'] && 'error'}
                            message={
                                errors['skype'] && errors['skype']?.message
                            }
                            label="skype"
                            placeHolder="add a Skype number"
                        />

                        <InputField
                            {...register('email')}
                            status={errors['email'] && 'error'}
                            message={
                                errors['email'] && errors['email']?.message
                            }
                            label="name"
                            placeHolder="add a valid email address"
                        />
                    </div>
                    <div className="mt-auto flex justify-center">
                        <Button
                            className="px-[5.25em] font-semibold"
                            disabled={showButton || isSubmitting}
                        >
                            {' '}
                            save changes{' '}
                        </Button>
                    </div>
                </div>
            </form>
        </DashboardPageLayout>
    )
}
export default Profile
