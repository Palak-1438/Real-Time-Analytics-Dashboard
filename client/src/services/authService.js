import axios from '../api/axios';

export const loginUser = async (data) => {
    const response = await axios.post('/auth/login', data);
    return response.data.data;
};

export const registerUser = async (data) => {
    const response = await axios.post('/auth/register', data);
    return response.data.data;
};

export const getMe = async () => {
    const response = await axios.get('/auth/me');
    return response.data.data;
};
