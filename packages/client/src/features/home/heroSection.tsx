import { Link } from "react-router-dom"
import GooseSrc from "@/assets/goose.png"
import { Button } from "@/components/button"
import DoorIcon from "@/assets/exit.svg?react"
import { useAppSelector } from "@/hooks/reduxHooks"

const HeroSection = () => {
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    return <div className="h-screen bg-accents-1">
        <div className="container h-full mx-auto flex flex-col justify-center items-center">
            <div className="w-full grid place-items-center">
                <img src={GooseSrc} alt="the horo goose" />
            </div>
            <h1 className="text-white text-[2.75rem] font-bold">GooseTrack</h1>
            <div className="flex flex-col md:flex-row-reverse justify-end items-center gap-2 mt-4">
                {isLoggedIn ? <DashboardButton /> : <AuthenticationButtons />}
            </div>
        </div>
    </div>
}

const AuthenticationButtons = () => {
    return <>
        <Link to='/auth/login'><Button
            icons={{ end: <DoorIcon className="stroke-accents-1" /> }}
            className="bg-white text-accents-1 hover:bg-accents-4 px-8"
        >
            Log in
        </Button>
        </Link>
        <Link to="/auth/signup">
            <Button className="underline hover:bg-accents-1"> Sign Up </Button>
        </Link>
    </>
}

const DashboardButton = () => {
    return <>
        <Link to='/dashboard/account'>
            <Button className="bg-white text-accents-1 hover:bg-accents-4 px-8">Go to Dashboard</Button>
        </Link>
    </>
}

export default HeroSection