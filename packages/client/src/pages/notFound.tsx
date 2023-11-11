import NotFoundSrc from "@/assets/rocket-goose.png"
import { Button } from "@/components/button"
import ThemedLayout from "@/layouts/themedLayout"
import { Link } from "react-router-dom"

const NotFound = () => {
    return <ThemedLayout>
        <div className="container mx-auto h-screen p-4 grid place-items-center">
            <div className="flex flex-col justify-center items-center gap-4">
                <div className="w-full flex justify-center items-center">
                    <span className="font-bold text-8xl md:text-[12.5em] text-accents-1">4</span>
                    <img src={NotFoundSrc} alt="not found" className="w-1/2 md:w-full" />
                    <span className="font-bold text-8xl md:text-[12.5em] text-accents-1">4</span>
                </div>
                <p className="text-[#111111] dark:text-text max-w-[24.1875em] text-center">We&apos;re sorry, the page you requested could not be found. Please go back to the homepage.</p>
                <Link to="/">
                    <Button className="mt-2"> Back To home </Button>
                </Link>
            </div>
        </div>
    </ThemedLayout>
}

export default NotFound