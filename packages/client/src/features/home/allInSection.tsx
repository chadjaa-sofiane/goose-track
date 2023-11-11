import DayOneImageSrc from "./assets/day1_image.png"
const AllInSection = () => {
    return <div className="w-full flex flex-col gap-10 justify-between md:flex-row">
        <div className="md:max-w-[17.1875em] md:ml-[4.8125em]">
            <span className="block text-accents-1 text-[6rem] font-bold">3.</span>
            <span className="block w-fit text-accents-1 text-[2rem] font-bold bg-accents-3 px-[1.125em] py-2 rounded-full uppercase mt-3.5">All IN</span>
            <h2 className="text-[2rem] font-bold mt-2"> ONE </h2>
            <p className="font-medium leading-[1.125rem] mt-3.5">GooseTrack is an all-in-one productivity tool that helps you stay on top of your tasks, events, and deadlines. Say goodbye to scattered to-do lists and hello to streamlined productivity with GooseTrack.</p>
        </div>
        <div>
            <img src={DayOneImageSrc} alt="all in one" />
        </div>
    </div>
}

export default AllInSection