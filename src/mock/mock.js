import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { testUsers, users } from './data/user'
import mockJS from 'mockjs'

const Random = mockJS.Random
let _users = users

const mock = new MockAdapter(axios)

export default {
  bootstrap () {
    // 用户登录
    mock.onPost('/login').reply(
      // Passing a function to reply
      // `config` is the axios config and contains things like the url
      // As of 1.7.0, reply function may return a Promise:
      config => {
        let { username, password } = JSON.parse(config.data)
        return new Promise((resolve, reject) => {
          let user = null
          setTimeout(() => {
            let hasUser = testUsers.some(u => {
              if (u.userId === username && u.password === password) {
                user = JSON.parse(JSON.stringify(u))
                user.password = undefined
                return true
              }
            })

            if (hasUser) {
              resolve([200, { code: 200, msg: '请求成功', user }])
            } else {
              resolve([200, { code: 500, msg: '账号或密码错误' }])
            }
          }, 1000)
        })
      })

    // 提交用户信息编辑
    mock.onPost('user/userEdit').reply(
      config => {
        let { id, userName, userId, address, birthday } = JSON.parse(config.data)

        return new Promise((resolve, reject) => {
          if (id == null) {
            // 新增
            _users.push({
              id: Random.id(),
              userName,
              userId,
              address,
              birthday
            })
          } else {
            _users.some(user => {
              if (user.id === id) {
                user.id = id
                user.userName = userName
                user.userId = userId
                user.address = address
                user.birthday = birthday
                return true
              }
              return false
            })
          }

          resolve([200, { code: 200, msg: '人员信息保存成功' }])
        })
      }
    )

    // 获取用户列表
    mock.onGet('/user/list').reply(
      config => {
        let { name } = config.params
        let mockUsers = _users.filter(user => {
          if (name && user.userName.indexOf(name) === -1) return false
          return true
        })
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([200, { users: mockUsers }])
          }, 1000)
        })
      }
    )

    // 获取用户列表（分页）
    mock.onGet('/user/listpage').reply(
      config => {
        let { page, size, name } = config.params
        let mockUsers = _users.filter(user => {
          if (name && user.userName.indexOf(name) === -1) return false
          return true
        })
        let total = mockUsers.length
        mockUsers = mockUsers.filter((u, index) => index < page * size && index >= (page - 1) * size)
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([200, {
              total,
              users: mockUsers
            }])
          }, 1000)
        })
      }
    )

    // 删除用户
    mock.onPost('user/userRemove').reply(config => {
      let { id } = JSON.parse(config.data)
      return new Promise((resolve, reject) => {
        _users.splice(_users.findIndex(user =>
          user.id === id
        ), 1)
        resolve([200, { code: 200, msg: '人员信息删除成功' }])
      })
    })

    // 批量删除用户
    mock.onPost('user/userBatchRemove').reply(config => {
      let { id } = JSON.parse(config.data)
      id = id.split(',')
      return new Promise((resolve, reject) => {
        _users = _users.filter(u => !id.includes(u.id))
        resolve([200, { code: 200, msg: '人员信息批量删除成功' }])
      })
    })
  }
}
