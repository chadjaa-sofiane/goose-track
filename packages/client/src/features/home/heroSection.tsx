import { Link } from "react-router-dom"
import HeroGoose from "./assets/hero_goose.png"
import { Button } from "@/components/button"
import DoorIcon from "@/assets/exit.svg?react"

const HeroSection = () => {
    return <div className="h-screen bg-accents-1">
        <div className="container h-full mx-auto flex flex-col justify-center items-center">
            <div className="w-full grid place-items-center">
                <img src={HeroGoose} alt="the horo goose" />
            </div>
            <h1 className="text-white text-[2.75rem] font-bold">GooseTrack</h1>
            <div className="flex flex-col md:flex-row-reverse justify-end items-center gap-2 mt-4">
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
            </div>
        </div>
    </div>
}

export default HeroSection