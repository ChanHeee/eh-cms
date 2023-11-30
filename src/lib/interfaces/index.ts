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
  age?: number
  gender?: string
  phone?: string
  jikbun?: string
  singeup?: string
  group1?: string
  group2?: string
  address?: string
  remarks?: string
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

export interface IFamily {
  _id?: string
  memberIds?: string[]
  members?: IMember[]
}

export interface IMember {
  _id?: string
  seongdo?: string
  classification?: string
}

export interface ISimbang {
  _id?: string
  seongdoId?: string
  date?: string
  hymn?: string
  bible?: string
  simbangja?: string
  detail?: string
}

export interface ISelectList {
  _id?: string
  teacherList: string[]
  familyClassList: string[]
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
