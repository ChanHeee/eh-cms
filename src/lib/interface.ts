export interface IUser {
  _id?: string
  name?: string
  password?: string
  permissions?: string[]
}

export interface ISeongdo {
  _id?: string
  name?: string
  avatar?: string
  birth?: string
  phone?: string
  jikbun?: string
  address?: string
  age?: number
  eduIds: IEducation[]
}

export interface IEducation {
  _id: string
  name: string
}

export interface ISeongdoResponse {
  seongdos: ISeongdo[]
  total: number
  take: number
  skip: number
}

export interface ISeongdoSearchBody {
  name?: string
  jikbun?: string[]
  sort?: string
  eduName?: string
  skip?: number
}
