import { SignupForm } from "@/features/auth"
import ThemedLayout from "@/layouts/themedLayout"
import { register } from "@/api/authApi"


const Signup = () => {
    return <ThemedLayout className="bg-[#dcebf7] dark:bg-bg">
        <SignupForm signUp={register} />
    </ThemedLayout>
}


export default Signup