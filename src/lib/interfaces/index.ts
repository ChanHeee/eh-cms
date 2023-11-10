export interface IGroup {
  name: string
  total: number
  child: IGroup[]
}

export interface IUser {
  _id?: string
  name?: string
  password?: string
  permissions?: string[]
}

export interface ISeongdo {
  _id?: string
  name?: string
  originalName?: string
  avatar?: string
  birth?: string
  gender?: string
  phone?: string
  jikbun?: string
  singeup?: string
  group1?: string
  group2?: string
  address?: string
  age?: number
  educations?: string[]
}

export interface IEducation {
  _id: string
  name: string
  teacher: string
  semester: string
  enrolledNum: number
  day: string
  time: string
  place: string
  startDate: string
  endDate: string
  status: string
  seongdos: string[]
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

export interface ISeongdoSearchParams {
  name?: string
  jikbun?: string[]
  order?: string
  eduName?: string
  page?: number
  group1?: string
  group2?: string
}

export interface IEducationResponse {
  educations: IEducation[]
  total: number
  take: number
  skip: number
}
