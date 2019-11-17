
import uuid from "uuid"
import {DateTime} from "luxon"
import {Result,ok,er,ResType} from "rayzul-ts"
import {Option,some,none,OptType} from "optsion-ts"


enum UserTypes {
  UnverifiedUser,
  VerifiedUser
}

type UserId = {
  id : string
}

type UnverifiedUser = {
  id         : UserId,
  email      : string,
  password   : string,
  expiration : DateTime
}

type User = {
  id       : UserId,
  email    : string,
  password : string
}

export type Log = {
  msg  : string,
  code : string
}

export type RepoOk = {}

export type RepoError = {
  log : Log
}

type RegisterUserDto = {
  email           : string,
  password        : string,
  confirmPassword : string
}

type RegisterUserReq = {
  user            : RegisterUserDto,
  findUserByEmail : (email: string) => Promise<Option<User>>,
  insertUser      : (user: UnverifiedUser) => Promise<Result<RepoOk,RepoError>>
}

type RegisterUserSuccess = {
  user: UnverifiedUser,
  log : Log
}

type RegisterUserFailure = {
  user : RegisterUserDto,
  log  : Log
}

const userExistsResult = (user: RegisterUserDto) : RegisterUserFailure => {
  return {
    user: user,
    log : {
      msg : "User with this email currently exists",
      code : ""
    }
  }
}

type RegisterUserDtoError = {}

function validateRegisterDto(registerDto: RegisterUserDto) : Result<RegisterUserDto,RegisterUserDtoError> {

  const isEmail = registerDto.email.indexOf('@') > -1

  const isValidPassword = registerDto.password.length > 8

  const passwordsMatch = registerDto.password == registerDto.confirmPassword

  if (isEmail && isValidPassword && passwordsMatch){
    return ok(registerDto)
  }
  else {
    return er({})
  }
}

const insertUser = async (req: RegisterUserReq): Promise<Result<RegisterUserSuccess,RegisterUserFailure>> => {
  
  const userInserted = await req.insertUser(req.user)

  switch(userInserted.type){
    case ResType.Er : {
      const res : RegisterUserFailure = {user: req.user, log: userInserted.error.log}
      return { type: ResType.Er, error: res }
    }
    case ResType.Ok : {
      const res : RegisterUserSuccess = {user: req.user, log: { msg: "User inserted", code: "user.inserted"}}
      return { type: ResType.Ok, item: res }
    }
  }
}

async function continueRegistration(req: RegisterUserReq): Promise<Result<RegisterUserSuccess,RegisterUserFailure>> {
  
  const userOpt = await req.findUserByEmail(req.user.email)
  
  switch(userOpt.type){

    case OptType.Some : {
      return { type: ResType.Er, error: userExistsResult(req.user) }
    }
    case OptType.None : {
      return await insertUser(req)
    }
  }
}

export const registerUser = async (req: RegisterUserReq): Promise<Result<RegisterUserSuccess,RegisterUserFailure>> => {

  switch(validateRegisterDto(req.user).type){

    case ResType.Er : {
        return await er({user: req.user, log : { msg: "", code : "s"}})
    }
    case ResType.Ok : {
      return await continueRegistration(req)
    }
  }
}

