import { SignupForm } from "@/features/auth"
import ThemedLayout from "@/layouts/themedLayout"

const Signup = () => {
    return <ThemedLayout className="bg-[#dcebf7] dark:bg-bg">
        <SignupForm/>
    </ThemedLayout>
}


export default Signup