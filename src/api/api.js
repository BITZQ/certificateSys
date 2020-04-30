import axios from 'axios'

let base = ''

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data) }

export const userList = params => { return axios.get(`${base}/user/list`, { params: params }) }

export const userListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }) }

export const userEdit = params => { return axios.post(`${base}/user/userEdit`, params).then(res => res.data) }

export const userRemove = params => { return axios.post(`${base}/user/userRemove`, params).then(res => res.data) }

export const userBatchRemove = params => { return axios.post(`${base}/user/userBatchRemove`, params).then(res => res.data) }
