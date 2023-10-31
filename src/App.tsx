import Button from '@/components/button'
import ExitIcon from '@/assets/exit.svg?react'
const App = () => {
    return (
        <div className="w-screen h-screen bg-bg text-text">
            <div className="container font-Inter m-auto text-text mt-4">
                <Button icons={{ end: <ExitIcon /> }}> Log out</Button>
            </div>
        </div>
    )
}

export default App
