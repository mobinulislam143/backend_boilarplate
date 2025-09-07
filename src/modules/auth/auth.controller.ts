
import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';

const registerUser = catchAsync(async(req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  res.cookie("token", result.token, {httpOnly: true})

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User created successfully",
    data: result
  })

})

const loginUser = catchAsync(async(req: Request, res: Response) => {
  const result = await AuthService.loginService(req.body)
  res.cookie("token", result.token, {httpOnly: true})
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:"User Logged in successfully",
    data: result
  })
})

export const AuthController = {
  registerUser,
  loginUser
}
// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const result = await AuthService.loginUser(email, password);
//     res.status(200).json(result);
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// };
