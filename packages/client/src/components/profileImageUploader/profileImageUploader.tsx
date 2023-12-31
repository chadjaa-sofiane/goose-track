import UserIcon from '@/assets/user.svg?react'
import PlusIcon from '@/assets/plus.svg?react'
import { cn } from '@/lib/utils'

interface ProfileImageUploaderProps {
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    className?: string
    src?: string | null
    alt?: string
}

const ProfileImageUploader = ({ onChange, className = "", src = null, alt = "user profile" }: ProfileImageUploaderProps) => {
    return (
        <>
            <input
                onChange={onChange}
                type="file"
                accept="image/*"
                hidden
                id="profile_image_uploader"
                aria-label="Upload profile image"
            />
            <label
                htmlFor="profile_image_uploader"
                className={cn(
                    "relative w-[7.75em] h-[7.75em] block p-[2.375em] border-2 border-accents-1 rounded-full cursor-pointer hover:scale-105 transition-transform",
                    className
                )}
            >
                {
                    src
                        ? <img src={src} alt={alt} className='absolute top-0 left-0 object-cover rounded-full'/>
                        : <UserIcon className="fill-accents-1 dark:fill-accents-3" />
                }
                <div className="absolute -bottom-2 right-6 bg-accents-1 rounded-full p-[3px]">
                    <PlusIcon />
                </div>
            </label>
        </>
    )
}

export default ProfileImageUploader
