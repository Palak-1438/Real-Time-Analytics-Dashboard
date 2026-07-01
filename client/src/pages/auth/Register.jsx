import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Activity } from 'lucide-react';
import { useRegister } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const registerMutation = useRegister();

    const onSubmit = (data) => {
        registerMutation.mutate(data, {
            onSuccess: () => navigate('/dashboard')
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="max-w-md w-full">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                        <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl text-center">Create an account</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enter your information to create an account
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {registerMutation.isError && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                                {registerMutation.error?.response?.data?.message || 'Failed to register'}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300">Name</label>
                            <input
                                {...register('name', { required: 'Name is required' })}
                                type="text"
                                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300">Email</label>
                            <input
                                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                                type="email"
                                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="m@example.com"
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300">Password</label>
                            <input
                                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                                type="password"
                                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                            {registerMutation.isPending ? 'Creating account...' : 'Sign Up'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;
