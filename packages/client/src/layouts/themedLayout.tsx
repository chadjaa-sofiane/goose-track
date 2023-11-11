
interface ThemedLayoutProps {
    children: React.ReactNode
}

const ThemedLayout = ({ children }: ThemedLayoutProps) => {
    return <div className="w-full h-full bg-bg text-text">
        {children}
    </div>
}

export default ThemedLayout