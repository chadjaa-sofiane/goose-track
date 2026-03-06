import { motion } from 'framer-motion'
import { HeroSection, Reviews } from '.'
import CalendarImageSrc from './assets/callender_image.png'
import DayOneImageSrc from './assets/day1_image.png'
import SideBarImageSrc from './assets/sideBar_image.png'

const sections = [
    {
        id: '01',
        title: 'Command Center Calendar',
        eyebrow: 'Clarity',
        body: 'Scan your schedule in seconds. OrbitFlow combines tasks, deadlines, and context so every week is mapped before it starts.',
        image: CalendarImageSrc,
        alt: 'Calendar dashboard preview',
    },
    {
        id: '02',
        title: 'Navigation With Intent',
        eyebrow: 'Control',
        body: 'Move between profile, filters, and timelines without friction. The layout keeps your highest-impact actions one click away.',
        image: SideBarImageSrc,
        alt: 'Sidebar navigation preview',
    },
    {
        id: '03',
        title: 'All Priorities In One Flow',
        eyebrow: 'Focus',
        body: 'Bring goals, routines, and reminders into one timeline so your energy goes to execution, not tool switching.',
        image: DayOneImageSrc,
        alt: 'Unified workflow preview',
    },
]

const Home = () => {
    return (
        <div className="pb-20">
            <HeroSection />
            <main className="container mx-auto px-5 md:px-8">
                <section className="mt-8 grid gap-8">
                    {sections.map((item, index) => (
                        <FeatureCard
                            key={item.id}
                            reverse={index % 2 === 1}
                            {...item}
                        />
                    ))}
                </section>
                <Reviews />
            </main>
        </div>
    )
}

interface FeatureCardProps {
    id: string
    eyebrow: string
    title: string
    body: string
    image: string
    alt: string
    reverse?: boolean
}

const FeatureCard = ({
    id,
    eyebrow,
    title,
    body,
    image,
    alt,
    reverse = false,
}: FeatureCardProps) => {
    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="glass-panel rounded-[1.8rem] p-5 md:p-8"
        >
            <div
                className={`grid items-center gap-7 md:grid-cols-2 ${
                    reverse ? 'md:[&>*:first-child]:order-2' : ''
                }`}
            >
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accents-1">
                        {eyebrow}
                    </p>
                    <h2 className="mt-3 text-3xl font-bold leading-tight text-accents-6 md:text-4xl">
                        {title}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-slate-700">
                        {body}
                    </p>
                    <span className="mt-6 inline-block rounded-full bg-accents-1 px-4 py-1 text-sm font-semibold text-white">
                        {id}
                    </span>
                </div>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden rounded-2xl"
                >
                    <img
                        src={image}
                        alt={alt}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                </motion.div>
            </div>
        </motion.article>
    )
}

export default Home
