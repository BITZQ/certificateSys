import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { testUsers } from './data/user'

const mock = new MockAdapter(axios)

export default {
  bootstrap () {
    // 用户登录
    mock.onPost('/login').reply(
      // Passing a function to reply
      // `config` is the axios config and contains things like the url
      // As of 1.7.0, reply function may return a Promise:
      (config) => {
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

    // 获取用户列表

    // 获取用户列表（分页）

    // 编辑用户信息

    // 删除用户

    // 批量删除用户
  }
}
