import BASE_URL from './BASE'

import { homeList } from '@/interfaces/home'

const homeApi = {
  home_list: `${BASE_URL}/home_list`
}

export type homeApiKeyType = keyof typeof homeApi

export interface homeApiKeyDataType {
  home_list: {
    code: number
    msg: string
    payload: {
      data: homeList[]
      total: number
    }
  }
}

export default homeApi
