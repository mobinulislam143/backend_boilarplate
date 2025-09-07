import { UserRole } from '@prisma/client';
import * as bcrypt from "bcrypt"
import config from "../config"
import prisma from "../shared/prisma"

export const initiateSuperAdmin = async () => {
  const hashedPassword: string = await bcrypt.hash(
    config.admin_password as string,
    Number(config.bcrypt_salt_rounds)
  )
  const payload: any = {
    name: "Joel Harrison",
    email: config.admin_email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  }

  const isExistUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  })

  if (isExistUser) return

  await prisma.user.create({
    data: payload,
  })
}
