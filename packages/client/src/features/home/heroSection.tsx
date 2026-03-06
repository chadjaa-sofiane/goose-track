import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GooseSrc from '@/assets/goose.png'
import { Button } from '@/components/button'
import DoorIcon from '@/assets/exit.svg?react'
import { useAppSelector } from '@/hooks/reduxHooks'
import { DEMO_USER } from '@/features/auth/demoUser'

const HeroSection = () => {
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

    return (
        <section className="relative overflow-hidden px-5 pb-20 pt-8 md:pt-14">
            <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-accents-3 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-accents-5 blur-3xl" />
            <div className="container mx-auto">
                <div className="glass-panel relative rounded-[2.2rem] px-6 py-10 md:px-10 md:py-14">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        className="grid items-center gap-8 md:grid-cols-[1.25fr_1fr]"
                    >
                        <div className="fade-in-up">
                            <p className="inline-flex rounded-full bg-accents-5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accents-1">
                                Productivity Reimagined
                            </p>
                            <h1 className="mt-5 text-4xl font-bold leading-tight text-accents-6 md:text-6xl">
                                OrbitFlow Planner
                            </h1>
                            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-700 md:text-lg">
                                Plan boldly, prioritize faster, and move work
                                forward with a visual calendar workspace built
                                for momentum.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                {isLoggedIn ? (
                                    <DashboardButton />
                                ) : (
                                    <AuthenticationButtons />
                                )}
                            </div>
                            {!isLoggedIn && <DemoAccountCard />}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="float-gentle mx-auto max-w-sm"
                        >
                            <img
                                src={GooseSrc}
                                alt="OrbitFlow mascot"
                                className="w-full drop-shadow-[0_25px_30px_hsl(206_22%_12%_/_0.18)]"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

const AuthenticationButtons = () => {
    return (
        <>
            <Link to="/auth/login">
                <Button
                    icons={{ end: <DoorIcon className="stroke-white" /> }}
                    className="rounded-xl bg-accents-1 px-8 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accents-2"
                >
                    Log in
                </Button>
            </Link>
            <Link to="/auth/signup">
                <Button className="rounded-xl border border-accents-1 bg-transparent px-8 py-3 text-accents-1 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accents-1 hover:text-white">
                    Create account
                </Button>
            </Link>
        </>
    )
}

const DemoAccountCard = () => {
    const loginUrl = `/auth/login?email=${encodeURIComponent(
        DEMO_USER.email
    )}&password=${encodeURIComponent(DEMO_USER.password)}`

    return (
        <div className="mt-6 max-w-xl rounded-2xl border border-accents-4 bg-accents-5/45 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accents-1">
                Demo Account
            </p>
            <p className="mt-2 text-sm text-slate-700">
                Email: <span className="font-semibold">{DEMO_USER.email}</span>
            </p>
            <p className="text-sm text-slate-700">
                Password:{' '}
                <span className="font-semibold">{DEMO_USER.password}</span>
            </p>
            <Link to={loginUrl} className="mt-3 inline-block">
                <Button className="rounded-xl bg-accents-1 px-5 py-2 text-sm text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accents-2">
                    Use demo account
                </Button>
            </Link>
        </div>
    )
}

const DashboardButton = () => {
    return (
        <Link to="/dashboard/account">
            <Button className="rounded-xl bg-accents-1 px-8 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accents-2">
                Open dashboard
            </Button>
        </Link>
    )
}

export default HeroSection
