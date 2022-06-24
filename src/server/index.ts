import homeApi, { homeApiKeyDataType } from './api/home'

const apis = {
  ...homeApi
}

export type apiKeyType = keyof typeof apis

export interface apiKeyDataType
  extends homeApiKeyDataType {}

export default apis
