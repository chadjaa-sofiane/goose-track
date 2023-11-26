import { SignupForm } from "@/features/auth"
import ThemedLayout from "@/layouts/themedLayout"
import { register } from "@/api/authApi"


const Signup = () => {
    return <ThemedLayout>
        <SignupForm signUp={register} />
    </ThemedLayout>
}


export default Signup