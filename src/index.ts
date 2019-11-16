
import uuid from "uuid"
import {DateTime} from "luxon"

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

const createUser = (user: UnverifiedUser): void => {
  console.log("")
}

