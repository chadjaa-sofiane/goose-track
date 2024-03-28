import { HeroSection, Reviews } from '.'
import CallenderImageSrc from './assets/callender_image.png'
import DayOneImageSrc from './assets/day1_image.png'
import SideBarImageSrc from './assets/sideBar_image.png'

const Home = () => {
    return (
        <div>
            <HeroSection />
            <div className="container mx-auto mt-16 flex flex-col gap-y-16 px-5 lg:px-32">
                <CallenderSection />
                <SideBarSection />
                <AllInSection />
            </div>
            <Reviews />
        </div>
    )
}

const CallenderSection = () => {
    return (
        <div className="w-full flex flex-col gap-10 justify-between md:flex-row">
            <div className="md:max-w-[17.1875em] md:ml-[4.8125em]">
                <span className="block text-accents-1 text-[6rem] font-bold">
                    1.
                </span>
                <span className="block w-fit text-accents-1 text-[2rem] font-bold bg-accents-3 px-[1.125em] py-2 rounded-full uppercase mt-3.5">
                    Callender
                </span>
                <h2 className="text-[2rem] font-bold mt-2"> VIEW </h2>
                <p className="font-medium leading-[1.125rem] mt-3.5">
                    GooseTrack's Calendar view provides a comprehensive overview
                    of your schedule, displaying all your tasks, events, and
                    appointments in a visually appealing and intuitive layout.
                </p>
            </div>
            <div>
                <img src={CallenderImageSrc} alt="callender" />
            </div>
        </div>
    )
}

const SideBarSection = () => {
    return (
        <div className="w-full flex flex-col gap-10 justify-between md:flex-row-reverse">
            <div className="md:max-w-[17.1875em] md:mr-[4.8125em]">
                <span className="block text-accents-1 text-[6rem] font-bold">
                    2.
                </span>
                <h2 className="text-[2rem] font-bold mt-2"> sideBar </h2>
                <p className="font-medium leading-[1.125rem] mt-3.5">
                    GooseTrack offers easy access to your account settings,
                    calendar, and filters. The "My Account" section allows you
                    to manage your profile information and preferences, while
                    the calendar provides a quick and convenient way to view
                    your upcoming events and tasks.
                </p>
            </div>
            <div>
                <img src={SideBarImageSrc} alt="sidebar" />
            </div>
        </div>
    )
}

const AllInSection = () => {
    return (
        <div className="w-full flex flex-col gap-10 justify-between md:flex-row">
            <div className="md:max-w-[17.1875em] md:ml-[4.8125em]">
                <span className="block text-accents-1 text-[6rem] font-bold">
                    3.
                </span>
                <span className="block w-fit text-accents-1 text-[2rem] font-bold bg-accents-3 px-[1.125em] py-2 rounded-full uppercase mt-3.5">
                    All IN
                </span>
                <h2 className="text-[2rem] font-bold mt-2"> ONE </h2>
                <p className="font-medium leading-[1.125rem] mt-3.5">
                    GooseTrack is an all-in-one productivity tool that helps you
                    stay on top of your tasks, events, and deadlines. Say
                    goodbye to scattered to-do lists and hello to streamlined
                    productivity with GooseTrack.
                </p>
            </div>
            <div>
                <img src={DayOneImageSrc} alt="all in one" />
            </div>
        </div>
    )
}

export default Home
