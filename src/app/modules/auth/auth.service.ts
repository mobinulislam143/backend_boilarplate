import { User } from '@prisma/client';
// import ApiError from "../../errors/ApiError";
// import { jwtHelpers } from "../../helper/jwtHelper";
// import prisma from "../../shared/prisma";
// import { generateToken } from '../../utils/jwt';
import * as bcrypt from "bcrypt";
// import config from "../../config";
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import config from '../../../config';
import prisma from '../../../shared/prisma';
import { jwtHelpers } from '../../../helper/jwtHelper';

 const registerUser = async (payload: User) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }
  const hashPassword: string = await bcrypt.hash(
    payload.password as string,
    Number(config.bcrypt_salt_rounds)
  );
  const result = await prisma.user.create({
    data: { ...payload, password: hashPassword },
  });

const accessToken = jwtHelpers.generateToken(
  {
    id: result.id,
    email: result.email,
    role: result.role,
  },
  config.jwt.jwt_secret!,
  config.jwt.expires_in as string
);

  return { data: result, token: accessToken };
};

 const loginService = async(payload: {email: string; password: string}) => {
  const existinguser = await prisma.user.findUnique({
    where:{email: payload.email}
  })
  if(!existinguser?.email){
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found! with this email" +payload.email
    )
  }

  const isCorrectedpassword : boolean = await bcrypt.compare(payload.password as string, existinguser.password as string)

  if(!isCorrectedpassword){
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password Incorrect!"
    )
  }

  const accessToken = jwtHelpers.generateToken(
    {
      id: existinguser.id,
      email: existinguser.email,
      role: existinguser.role
    },
    config.jwt.jwt_secret!,
    config.jwt.expires_in as string
  )
  return {data: existinguser, token: accessToken}

}

export const AuthService = {
  registerUser,
  loginService
};
