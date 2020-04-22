import axios from 'axios'

let base = ''

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data) }

export const userList = params => { return axios.get(`${base}/user/list`, { params: params }) }

export const userListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }) }
