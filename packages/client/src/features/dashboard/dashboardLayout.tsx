import ThemedLayout from "@/layouts/themedLayout"
import { NavigationBar } from "./components/navigationBar"
import React, { useState } from "react"
import { Outlet, useOutletContext } from "react-router-dom"
import { Header } from "./components/header"
import DashboardRoutesfrom from "@/features/dashboard/routes"

export type OutletContextType = {
    openNav: boolean;
    setOpenNav: React.Dispatch<React.SetStateAction<boolean>>;
}


const DashboardLayout = () => {
    const [openNav, setOpenNav] = useState(false)

    return <ThemedLayout className="min-h-screen bg-[#dcebf7] dark:bg-bg">
        <main className="h-screen flex items-stretch">
            <NavigationBar open={openNav} setOpen={setOpenNav} routes={DashboardRoutesfrom} />
            <div className="flex-1 flex flex-col gap-y-[2.375em] py-8 px-[2.875em] dark:bg-[#171820] ">
                <Outlet context={{ openNav, setOpenNav } satisfies OutletContextType} />
            </div>
        </main>
    </ThemedLayout>
}

interface DashboardPageLayoutProps {
    title: string
    children: React.ReactNode
}

export const DashboardPageLayout = ({ title, children }: DashboardPageLayoutProps) => {
    const { setOpenNav } = useOutletContext<OutletContextType>()
    return <>
        <Header title={title} setOpen={setOpenNav} />
        <section>
            {children}
        </section>
    </>
}

export default DashboardLayout