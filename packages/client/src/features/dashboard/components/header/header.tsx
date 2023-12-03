import { Button } from "@/components/button"
import SunIcon from "@/features/dashboard/assets/sun.svg?react"
import MoonIcon from "@/features/dashboard/assets/moon.svg?react"
import BurgerMenuIcon from '@/features/dashboard/assets/burger-menu.svg?react'

interface HeaderProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    title: string
}

const Header = ({ setOpen, title }: HeaderProps) => {

    return <header>
        <div className="flex items-center">
            <div className="flex-1 flex items-center justify-between">
                <div
                    className="lg:hidden cursor-pointer"
                    onClick={() => setOpen(true)}
                    aria-label="Close navigation">
                    <BurgerMenuIcon />
                </div>
                <h1 className="hidden font-bold text-[2rem] lg:block">{title}</h1>
            </div>
            <div className="flex items-center gap-x-[1.625em]">
                <Button className="font-semibold text-xs md:text-lg px-8 py-3"> Feedback </Button>
                <div className="flex items-center gap-x-2">
                    <div className="cursor-pointer">
                        <SunIcon className="hidden dark:block" />
                        <MoonIcon className="black dark:hidden" />
                    </div>
                    <span className="font-bold text-xs md:text-lg">
                        Nadiaa
                    </span>
                    <div className="w-8 h-8 md:w-[2.75em] md:h-[2.75em] rounded-full bg-red-50"></div>
                </div>
            </div>
        </div>
    </header>
}


export default Header