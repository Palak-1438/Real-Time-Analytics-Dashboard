import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, registerUser } from '../services/authService';
import { toast } from 'react-toastify';

export const useAuth = () => useContext(AuthContext);

export const useLogin = () => {
    const { login } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            login(data.user, data.token);
            queryClient.setQueryData(['user'], data.user);
            toast.success('Successfully logged in!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to login');
        }
    });
};

export const useRegister = () => {
    const { login } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            login(data.user, data.token);
            queryClient.setQueryData(['user'], data.user);
            toast.success('Successfully registered!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to register');
        }
    });
};
