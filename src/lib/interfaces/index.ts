export interface IGroup {
  name: string
  count?: number
  child: IGroup[]
}

export interface IUser {
  _id?: string
  name?: string
  username?: string
  password?: string
  allowedGroup?: string[]
}

export interface ISeongdo {
  _id: string
  name: string
  originalName: string
  avatar: string
  birth: string
  age?: number
  gender: string
  phone: string
  jikbun: string
  singeup: string
  group1: string
  group2: string
  address: string
  remarks: string
  enrolled_at: string
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
}

export interface ISeongdoEduPage {
  totalSize: number
  totalPage: number
  requestPage: number
  requestSize: number
  requestParams: {
    take?: number
    order?: string
    seongdoId?: string
    educationId?: string
    className?: string
    birthStart?: string
    birthEnd?: string
  }
}

export interface ISeongdoPage {
  totalSize: number
  totalPage: number
  requestPage: number
  requestSize: number
  requestParams: {
    take?: number
    order?: string
    name?: string
    jikbun?: string[]
    group1?: string
    group2?: string
  }
}

export interface IPage {
  totalSize: number
  totalPage: number
  requestPage: number
  requestSize: number
  requestParams: {
    name?: string
    jikbun?: string[]
    order?: string
    className?: string
    group1?: string
    group2?: string
    take?: number
  }
}

export interface ISeongdoEduPopulate {
  seongdo: ISeongdo | string
  education: IEducation | string
}
export interface ISeongdoEdu {
  seongdo?: string
  education?: string
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
  date: string
  hymn?: string
  bible?: string
  simbangja: string
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
  className?: string
  birthStart?: string
  birthEnd?: string
}

export interface ISeongdoEduSearchParams {
  className?: string
  name?: string
  order?: string
  jikbun?: string[]
  educationId?: string
  birthStart?: string
  birthEnd?: string
  group1?: string
  group2?: string
}

export interface IEducationResponse {
  educations: IEducation[]
  total: number
  take: number
  skip: number
}
