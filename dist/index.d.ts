import { DateTime } from "luxon";
import { Result } from "rayzul-ts";
import { Option } from "optsion-ts";
declare type UserId = {
    id: string;
};
declare type UnverifiedUser = {
    id: UserId;
    email: string;
    password: string;
    expiration: DateTime;
};
declare type User = {
    id: UserId;
    email: string;
    password: string;
};
export declare type Log = {
    msg: string;
    code: string;
};
export declare type RepoOk = {};
export declare type RepoError = {
    log: Log;
};
declare type RegisterUserReq = {
    user: UnverifiedUser;
    findUserByEmail: (email: string) => Promise<Option<User>>;
    insertUser: (user: UnverifiedUser) => Promise<Result<RepoOk, RepoError>>;
};
declare type RegisterUserSuccess = {
    user: UnverifiedUser;
    log: Log;
};
declare type RegisterUserFailure = {
    user: UnverifiedUser;
    log: Log;
};
export declare const registerUser: (req: RegisterUserReq) => Promise<Result<RegisterUserSuccess, RegisterUserFailure>>;
export {};
