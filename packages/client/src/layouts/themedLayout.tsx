import { cn } from '@/lib/utils'

interface ThemedLayoutProps {
    children: React.ReactNode
    className?: string
}

const ThemedLayout = ({ children, className }: ThemedLayoutProps) => {
    return (
        <div className={cn('w-full min-h-screen bg-bg text-text', className)}>
            {children}
        </div>
    )
}

export default ThemedLayout
