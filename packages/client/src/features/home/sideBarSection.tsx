import SideBarImageSrc from "./assets/sideBar_image.png"
const SideBarSection = () => {
    return <div className="w-full flex flex-col gap-10 justify-between md:flex-row-reverse">
        <div className="md:max-w-[17.1875em] md:mr-[4.8125em]">
            <span className="block text-accents-1 text-[6rem] font-bold">2.</span>
            <h2 className="text-[2rem] font-bold mt-2"> sideBar </h2>
            <p className="font-medium leading-[1.125rem] mt-3.5">GooseTrack offers easy access to your account settings, calendar, and filters. The "My Account" section allows you to manage your profile information and preferences, while the calendar provides a quick and convenient way to view your upcoming events and tasks.</p>
        </div>
        <div>
            <img src={SideBarImageSrc} alt="sidebar" />
        </div>
    </div>
}

export default SideBarSection