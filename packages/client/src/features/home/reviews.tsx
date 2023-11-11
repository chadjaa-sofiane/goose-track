import User1Image from "./assets/user1.png"
import User2Image from "./assets/user2.png"
import LeftArrowIcon from "@/assets/left-arrow.svg?react"
import RightArrowIcon from "@/assets/right-arrow.svg?react"
import StarIcon from "@/assets/star.svg?react"

const Reviews = () => {
    return <div className="container mx-auto mt-[6.25em]">
        <h2 className="text-accents-1 text-[1.5rem] font-bold text-center flex-wrap"> REVIEWS </h2>
        <div className="flex flex-wrap mt-[3.125em]">
            <div className="flex gap-x-6">
                {users.map(user => (
                    <Review
                        key={user.id}
                        name={user.name}
                        rate={user.rate}
                        image={user.image}
                        message={user.message}
                    />
                ))}
            </div>
            <div className="w-full mt-8 flex justify-center gap-x-4">
                <LeftArrowIcon className="cursor-pointer" />
                <RightArrowIcon className="cursor-pointer" />
            </div>
        </div>
    </div>
}

interface ReviewProps {
    image: string
    name: string
    rate: number
    message: string
}



const Review = ({ image, name, rate, message }: ReviewProps) => {
    return <div className="flex gap-x-[1.125em] p-8 border border-[#111111] border-opacity-10 rounded-md">
        <div className="w-[3.625em] h-[3.625em]">
            <img className="w-full h-full object-fill" src={image} alt={name} />
        </div>
        <div className="flex-1">
            <div>
                <span className="text-[1.125rem] font-bold" > {name} </span>
                <div className="flex gap-x-2.5 mt-[0.8125em]">
                    {[false, false, false, false, false].map((_, index) => (<StarIcon key={index} className={
                        `
                            ${index + 1 <= rate ? "fill-[#FFAC33]" : "fill-[#CEC9C1]"}
                        `
                    } />))}
                </div>
            </div>
            <p className="leading-[1.125rem] font-medium mt-6"> {message} </p>
        </div>
    </div>
}

const users = [
    {
        id: 2,
        name: " Olena Doe ",
        image: User2Image,
        rate: 2,
        message: "GooseTrack is impressive, the calendar view and filter options make it easy to stay organized and focused. Highly recommended."
    },
    {
        id: 1,
        name: "Alexander Hubbard ",
        image: User1Image,
        rate: 4,
        message: "GooseTrack is incredibly helpful, the sidebar with account management, calendar, and filter options make navigation seamless. Great for staying organized."
    }
]

export default Reviews 