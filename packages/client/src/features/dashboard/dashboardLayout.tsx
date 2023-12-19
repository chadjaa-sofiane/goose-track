import ThemedLayout from '@/layouts/themedLayout'
import { NavigationBar } from './components/navigationBar'
import React, { useState } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import { Header } from './components/header'
import DashboardRoutesfrom from '@/features/dashboard/routes'

export type OutletContextType = {
    openNav: boolean
    setOpenNav: React.Dispatch<React.SetStateAction<boolean>>
}

const DashboardLayout = () => {
    const [openNav, setOpenNav] = useState(false)

    return (
        <ThemedLayout className="min-h-screen bg-[#dcebf7] dark:bg-bg">
            <div className="flex">
                <NavigationBar
                    open={openNav}
                    setOpen={setOpenNav}
                    routes={DashboardRoutesfrom}
                />
                <main className="w-full lg:w-10/12 min-h-screen h-fit flex flex-col gap-y-[2.375em] px-5 py-6 md:py-8 md:px-[2.875em] dark:bg-[#171820]">
                    <Outlet
                        context={
                            { openNav, setOpenNav } satisfies OutletContextType
                        }
                    />
                </main>
            </div>
        </ThemedLayout>
    )
}

interface DashboardPageLayoutProps {
    title: string
    children: React.ReactNode
}

export const DashboardPageLayout = ({
    title,
    children,
}: DashboardPageLayoutProps) => {
    const { setOpenNav } = useOutletContext<OutletContextType>()
    return (
        <>
            <Header title={title} setOpen={setOpenNav} />
            {children}
        </>
    )
}

export default DashboardLayout
