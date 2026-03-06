import { LoginForm } from '@/features/auth'
import ThemedLayout from '@/layouts/themedLayout'

const Login = () => {
    return (
        <ThemedLayout className="bg-bg">
            <LoginForm />
        </ThemedLayout>
    )
}

export default Login
