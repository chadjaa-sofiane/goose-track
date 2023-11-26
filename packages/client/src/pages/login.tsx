import { LoginForm } from "@/features/auth"
import ThemedLayout from "@/layouts/themedLayout"
import { login } from "@/api/authApi"

const Login = () => {
    return <ThemedLayout className="bg-[#dcebf7] dark:bg-bg">
        <LoginForm login={login} />
    </ThemedLayout>
}

export default Login