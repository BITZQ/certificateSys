// 生成用户信息模拟数据
import mock from 'mockjs'

const Random = mock.Random

const testUsers = [{
  username: '张大宝',
  userId: 'zq@cnic.cn',
  password: 'zq_123456',
  avatar: 'http://159.226.28.4/uploadFile/userFile/90237803.jpg'
}]

const users = []

const userCount = Random.integer(60, 200)

for (let i = 0; i < userCount; i++) {
  users.push({
    id: Random.id(),
    userName: Random.cname(),
    userId: Random.email(),
    address: mock.mock('@county(true)'),
    birthday: Random.date('yyyy-MM-dd')
  })
}

export {
  testUsers,
  users
}
