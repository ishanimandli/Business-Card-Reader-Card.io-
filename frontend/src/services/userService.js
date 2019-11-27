import axios from 'axios';

const baseUrl = 'http://10.10.10.61:5000/api/v1';


export async function userLogin(formData){
    const PATH = baseUrl  + '/login';
    const response = await axios.post(PATH, formData);
    // console.log(response);
    return response
}
export async function userSignup(formData){
    const PATH = baseUrl  + '/signup';
    const response = await axios.post(PATH, formData);
    return {response: response.data, status: response.data.status}
}
export async function getCardData(){
    const PATH = baseUrl + '/getCardData';
    // console.log(localStorage.getItem('token'))
    const response = await axios.get(PATH,{
                                headers: {
                                Authorization: "Bearer " + localStorage.getItem('token')}
                            });
    if(response.status===200){
        // console.log(response)
        return {data: response.data.cards, company_list: response.data.comapny_list, status: response.data.status}
    }
    else{
        return {message: response.message, status: response.status}
    }
}
export async function cardFromCompany(companyName){
    const PATH = baseUrl + '/searchByCompany/';
    const response = await axios.get(PATH  + companyName,{
                                     headers: {
                                     Authorization: "Bearer " + localStorage.getItem('token')}
                                });
    // console.log(response)
    return {searchData: response.data.cards, status: response.data.status}
}

export async function getUserProfile(id){
    const PATH = baseUrl + '/userProfile'
    const response = await axios.get(PATH,{
                                        headers: {
                                        Authorization: "Bearer " + localStorage.getItem('token')}
                            });
    // console.log(response.data.info)
    return {info: response.data.info, status: response.data.status}
}

export async function setUserProfile(formData){
    const PATH = baseUrl + '/setUserProfile'
    const response = await axios.post(PATH,formData,{
                                                    headers: {
                                                    Authorization: "Bearer " + localStorage.getItem('token')}
                                            });
    return {status: response.data.status}
}

export async function getCard(card_id){
    const PATH = baseUrl + '/showCardData/'
    const response = await axios.get(PATH + card_id,{
                                                        headers: {
                                                        Authorization: "Bearer " + localStorage.getItem('token')}
                                                });
    return {cardData: response.data.cardData, message: response.data.message, status: response.data.status}
}

export async function updateCard(formData){
    const PATH = baseUrl + '/updateCard'
    const response = await axios.post(PATH, formData,{
                                                    headers: {
                                                    Authorization: "Bearer " + localStorage.getItem('token')}
                                            });
    return {message: response.data.message, status: response.data.status}
}

export async function deleteCard(formData){
    const PATH = baseUrl + '/deleteCard'
    const response = await axios.post(PATH, formData,{
                                                        headers: {
                                                        Authorization: "Bearer " + localStorage.getItem('token')}
                                                });
    return {message: response.data.message, status: response.data.status}
}

export async function updatePassword(formData){
    const PATH = baseUrl + '/updatePassword'
    const response = await axios.post(PATH, formData,{
                                                        headers: {
                                                        Authorization: "Bearer " + localStorage.getItem('token')}
                                                });
    return {message: response.data.message, status: response.data.status}
}

export async function loadNewCardData(formData){
    const PATH = baseUrl + '/scanCard'
    const response = await axios.post(PATH, formData,{
                                                        headers: {
                                                        Authorization: "Bearer " + localStorage.getItem('token')},
                                                        'Content-Type' : 'multipart/form-data'
                                                });
    return {data: response.data.data, message: response.data.message, status: response.data.status }
}

export async function saveNewCard(formData){
    const PATH = baseUrl + '/saveNewCard'
    const response = await axios.post(PATH,formData,{
                                                        headers: {
                                                        Authorization: "Bearer " + localStorage.getItem('token')}
                                                });
    return {message: response.data.message, status: response.data.status}
}