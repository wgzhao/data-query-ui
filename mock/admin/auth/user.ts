import { MockMethod, MockConfig } from 'vite-plugin-mock'
import {Mock} from 'mockjs'

const Random = Mock.Random;

const token = Random.string('lower', 32)

const userInfo = {
  id: Random.id(),
  username: Random.name(),
  token: token
}

export default [
  {
    url: '/admin/api/v1/auth/login',
    type: 'post',
    response: () => {
      return {
        code: 200,
        message: "success",
        data: userInfo
      }
    }
  }
]
