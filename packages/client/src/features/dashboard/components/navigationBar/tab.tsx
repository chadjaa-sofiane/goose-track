import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface TabProps {
    text: string
    href: string
    icon: React.ReactElement
    active?: boolean
    onClick?: () => void
}

const Tab = ({ text, href, icon, active = false, onClick = () => null }: TabProps) => {
    return <li>
        <Link to={href} onClick={onClick} aria-current={active ? "page" : undefined}>
            <div className={cn(
                "flex items-center gap-x-2.5 px-5 py-4 rounded-md bg-accents-5 dark:bg-accents-1 bg-opacity-0 dark:bg-opacity-0 transition-colors ease-in-out duration-200",
                {
                    "text-accents-1 dark:text-text bg-opacity-100 dark:bg-opacity-100": active,
                    "hover:bg-opacity-10 text-[#999999]": !active,
                }
            )}>
                <span className={cn(
                    "stroke-[#999999] dark:stroke-white",
                    {
                        "stroke-accents-1": active
                    }
                )}>
                    {icon}
                </span>
                <span className="font-semibold text-base leading-5" >
                    {text}
                </span>
            </div>
        </Link>
    </li>
}

export default Tab