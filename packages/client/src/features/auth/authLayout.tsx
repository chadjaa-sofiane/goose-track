import { cn } from "@/lib/utils"


interface AuthLayoutProps {
    children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return <div className="relative w-sreen h-screen grid place-items-center isolate">
        {children}
    </div>
}


export const AuthForm = ({ children, className, ...rest }: React.ComponentPropsWithoutRef<"form">) => {
    return (
        <form {...rest} className={cn("w-[30em] max-w-full p-10 border border-accents-1 flex flex-col gap-y-10 bg-bg rounded-lg border-opacity-25 dark:bg-accents-1 dark:bg-opacity-5", className)}>
            {children}
        </form>
    )
}

export default AuthLayout