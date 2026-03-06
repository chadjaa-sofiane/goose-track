import { motion } from 'framer-motion'
import User1Image from './assets/user1.png'
import User2Image from './assets/user2.png'
import StarIcon from '@/assets/star.svg?react'

const Reviews = () => {
    return (
        <section className="mt-12 md:mt-16">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5 }}
                className="glass-panel rounded-[1.8rem] px-5 py-8 md:px-8"
            >
                <h2 className="text-center text-3xl font-bold text-accents-6 md:text-4xl">
                    Loved by teams shipping fast
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-center text-slate-700">
                    OrbitFlow helps people stay accountable without drowning in
                    tabs, toggles, and clutter.
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {users.map((user) => (
                        <Review
                            key={user.id}
                            name={user.name}
                            rate={user.rate}
                            image={user.image}
                            message={user.message}
                        />
                    ))}
                </div>
            </motion.div>
        </section>
    )
}

interface ReviewProps {
    image: string
    name: string
    rate: number
    message: string
}

const Review = ({ image, name, rate, message }: ReviewProps) => {
    return (
        <motion.article
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-accents-1/20 bg-white/80 p-5"
        >
            <div className="flex items-center gap-x-4">
                <img
                    className="h-14 w-14 rounded-full object-cover"
                    src={image}
                    alt={name}
                />
                <div>
                    <p className="text-lg font-bold text-accents-6">{name}</p>
                    <div className="mt-2 flex gap-x-1.5">
                        {[false, false, false, false, false].map((_, index) => (
                            <StarIcon
                                key={index}
                                className={
                                    index + 1 <= rate
                                        ? 'fill-[#ffac33]'
                                        : 'fill-[#d9d8d2]'
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
            <p className="mt-5 leading-relaxed text-slate-700">{message}</p>
        </motion.article>
    )
}

const users = [
    {
        id: 2,
        name: 'Olena Doe',
        image: User2Image,
        rate: 4,
        message:
            'OrbitFlow gives me one clean place to align deadlines and tasks. I spend less time planning and more time finishing work.',
    },
    {
        id: 1,
        name: 'Alexander Hubbard',
        image: User1Image,
        rate: 5,
        message:
            'The dashboard feels focused and quick. Calendar + profile + task flow now feels like one system instead of separate tools.',
    },
]

export default Reviews
