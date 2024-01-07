import axios from '../utils/axiosCustomize'

// accommodation - By Admin 
const postCreateAccommodation = (data) => {
    return axios.post('api/v1/accommodation', data)
}

const getAccommodation = (query) => {
    return axios.get(`api/v1/accommodation?${query}`)
}

const deleteAccommodation = (id) => {
    return axios.delete(`api/v1/accommodation/${id}`)
}

const updateAccommodation = (data) => {
    return axios.patch('api/v1/accommodation', data)
}
// import/export Excel
const importExcel = (fileExcel) => {
    const formData = new FormData();
    formData.append("fileExcel", fileExcel);
    return axios({
        method: 'post',
        url: '/api/v1/excel/import',
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}

const exportExcel = () => {
    return axios.get(`api/v1/excel/export`)
}

// User ----------------------------------------------------------------------------------------------------

const getUsers = (query) => {
    return axios.get(`api/v1/users?${query}`)
}

const postCreateUser = (data) => {
    return axios.post('api/v1/users', data)
}

const deleteUser = (id) => {
    return axios.delete(`api/v1/users/${id}`)
}

const updateUser = (data) => {
    return axios.patch('api/v1/users', data)
}

// Auth ----------------------------------------------------------------------------------------------------

const postLogin = (username, password) => {
    return axios.post('api/v1/auth/login', { username, password })
}

const getAccount = () => {
    return axios.get('api/v1/auth/account')
}

const postLogOut = () => {
    return axios.post('api/v1/auth/logout')
}


export {
    // Excel
    importExcel,
    exportExcel,
    // ---- accommodation
    updateAccommodation,
    deleteAccommodation,
    postCreateAccommodation,
    getAccommodation,
    // ----- user
    getUsers,
    postCreateUser,
    deleteUser,
    updateUser,
    // ----- auth
    postLogin,
    getAccount,
    postLogOut,

}