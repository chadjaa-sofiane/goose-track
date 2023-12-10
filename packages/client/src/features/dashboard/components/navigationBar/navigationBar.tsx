import GooseSrc from '@/assets/goose.png'
import Tab from './tab'
import { useLocation } from 'react-router-dom'
import { Button } from '@/components/button'
import ExitIcon from '@/assets/exit.svg?react'
import CloseIcon from '@/features/dashboard/assets/close.svg?react'
import { cn } from '@/lib/utils'
import { type Route } from '@/features/dashboard/routes'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { logoutAsync } from '@/redux/authSlice'

interface NavigationBarProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    routes: Route[]
}

const NavigationBar = ({ open, setOpen, routes }: NavigationBarProps) => {
    const location = useLocation()
    const currentTab = location.pathname.split('/').at(-1)
    const dispatch = useAppDispatch()

    const handleLogout = async () => {
        await dispatch(logoutAsync())
    }

    return (
        <div
            className={cn(
                'fixed top-0 left-0 lg:relative h-screen flex flex-col p-8 gap-y-8 bg-bg transition-transform ease-out duration-300 z-10',
                {
                    '-translate-x-full lg:translate-x-0': !open,
                }
            )}
        >
            <div className="flex items-center gap-x-2.5">
                <div className="w-[4.4375em] h-[4.25em]">
                    <img className="object-cover" src={GooseSrc} alt="Goose" />
                </div>
                <h1 className="font-bold text-2xl text-accents-1 dark:text-white">
                    GooseTrack
                </h1>
                <div
                    className="lg:hidden cursor-pointer"
                    onClick={() => {
                        setOpen(false)
                    }}
                >
                    <CloseIcon />
                </div>
            </div>
            <h2 className="text-[#999999] dark:text-[#585a5d] font-bold ">
                {' '}
                User Panel{' '}
            </h2>
            <nav>
                <ul className="flex flex-col gap-y-4">
                    {routes.map(({ path, title, icon }, index) => (
                        <Tab
                            key={index}
                            text={title}
                            href={path || ''}
                            icon={icon}
                            active={path === currentTab}
                            onClick={() => {
                                setOpen(false)
                            }}
                        />
                    ))}
                </ul>
            </nav>
            <div className="flex-1 flex flex-col justify-end items-start">
                <Button
                    onClick={handleLogout}
                    icons={{
                        end: (
                            <ExitIcon
                                className="stroke-white"
                                aria-label="Log out"
                            />
                        ),
                    }}
                >
                    {' '}
                    Log out{' '}
                </Button>
            </div>
        </div>
    )
}

export default NavigationBar
