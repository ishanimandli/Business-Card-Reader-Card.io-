import axios from 'axios';

const baseUrl = 'http://10.10.10.61:5000/api/v1';

export async function userLogin(formData){
    const PATH = baseUrl  + '/login';
    const response = await axios.post(PATH, formData);
    console.log(response);
    return {message:response.data.message, status:response.data.status, user_id:response.data.user_id}
}
export async function userSignup(formData){
    const PATH = baseUrl  + '/signup';
    const response = await axios.post(PATH, formData);
    return {response: response.data, status: response.data.status}
}
export async function getCardData(id){
    const PATH = baseUrl + '/getCardData/';
    const response = await axios.get(PATH+id);
    if(response.status===200){
        
        return {data:response.data.cards, status: response.data.status}
    }
    else{
        return {message: response.message, status: response.status}
    }
}
