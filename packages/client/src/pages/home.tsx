import { AllInSection, CallenderSection, HeroSection, Reviews } from "@/features/home"
import SideBarSection from "@/features/home/sideBarSection"

const Home = () => {
    return <div>
        <HeroSection />
        <div className="container mx-auto mt-16 flex flex-col gap-y-16 px-5 lg:px-32">
            <CallenderSection />
            <SideBarSection />
            <AllInSection />
        </div>
        <Reviews />
    </div>
}

export default Home