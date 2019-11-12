import axios from 'axios';

const baseUrl = 'http://10.10.10.61:5000/api/v1';

export async function userLogin(formData){
    const PATH = baseUrl  + '/login';
    const response = await axios.post(PATH, formData);
    return {response: response.data, status: response.status}
}
export async function userSignup(formData){
    const PATH = baseUrl  + '/signup';
    const response = await axios.post(PATH, formData);
    return {response: response.data, status: response.status}
}
