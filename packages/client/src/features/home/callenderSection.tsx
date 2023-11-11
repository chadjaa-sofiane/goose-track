import CallenderImageSrc from "./assets/callender_image.png"
const CallenderSection = () => {
    return <div className="w-full flex flex-col gap-10 justify-between md:flex-row">
        <div className="md:max-w-[17.1875em] md:ml-[4.8125em]">
            <span className="block text-accents-1 text-[6rem] font-bold">1.</span>
            <span className="block w-fit text-accents-1 text-[2rem] font-bold bg-accents-3 px-[1.125em] py-2 rounded-full uppercase mt-3.5">Callender</span>
            <h2 className="text-[2rem] font-bold mt-2"> VIEW </h2>
            <p className="font-medium leading-[1.125rem] mt-3.5">GooseTrack's Calendar view provides a comprehensive overview of your schedule, displaying all your tasks, events, and appointments in a visually appealing and intuitive layout.</p>
        </div>
        <div>
            <img src={CallenderImageSrc} alt="callender"/>
        </div>
    </div>
}

export default CallenderSection