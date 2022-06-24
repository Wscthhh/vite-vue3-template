import { Canceler } from "axios"

export interface IReqList {
    url: string
    cancel: Canceler
    errorMessage: string
  }