import UserIcon from '@/assets/user.svg?react'
import PlusIcon from '@/assets/plus.svg?react'

interface ProfileImageUploaderProps {
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const ProfileImageUploader = ({ onChange }: ProfileImageUploaderProps) => {
    return (
        <>
            <input
                onChange={onChange}
                type="file"
                accept="image/*"
                hidden
                id="profile_image_uploader"
            />
            <label
                htmlFor="profile_image_uploader"
                className="relative block p-[2.375em] border-2 border-accents-1 rounded-full cursor-pointer hover:scale-105 transition-transform"
            >
                <UserIcon className="fill-accents-1 dark:fill-accents-3" />
                <div className="absolute -bottom-2 right-6 bg-accents-1 rounded-full p-[3px]">
                    <PlusIcon />
                </div>
            </label>
        </>
    )
}

export default ProfileImageUploader
