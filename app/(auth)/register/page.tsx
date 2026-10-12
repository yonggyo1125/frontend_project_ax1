import RegisterForm from '@/domains/auth/components/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
            <RegisterForm />
        </div>
    );
}
