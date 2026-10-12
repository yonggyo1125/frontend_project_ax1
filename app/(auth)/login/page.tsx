import LoginForm from '@/domains/auth/components/LoginForm';

export default function LoginPage() {
    return (
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
            <LoginForm />
        </div>
    );
}
