import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import handleZodError from "../../errors/handleZodError";
import parsePrismaValidationError from "../../errors/parsePrismaValidationError";
import ApiError from "../../errors/ApiError";
// import ApiError from "../../errors/ApiErrors";

// TODO Replace `config.NODE_ENV` with your actual environment configuration

// TODO
const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
};

const GlobalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: any = httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong!";
  let errorSources = [];

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  // Handle Custom ApiError
  else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ type: "ApiError", details: err.message }];
  }
  // handle prisma client validation errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = parsePrismaValidationError(err.message);
    errorSources.push("Prisma Client Validation Error");
  }
  // Prisma Client Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message =
      "Failed to initialize Prisma Client. Check your database connection or Prisma configuration.";
    errorSources.push("Prisma Client Initialization Error");
  }
  // Prisma Client Rust Panic Error
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message =
      "A critical error occurred in the Prisma engine. Please try again later.";
    errorSources.push("Prisma Client Rust Panic Error");
  }
  // Add this case to your GlobalErrorHandler function
else if (err instanceof Prisma.PrismaClientKnownRequestError) {
  statusCode = httpStatus.CONFLICT; // 409 is appropriate for conflicts
  
  // Handle unique constraint violations (P2002)
  if (err.code === 'P2002') {
    const field = err.meta?.target as string[];
    message = `Duplicate entry: A record with this ${field?.join(', ')} already exists.`;
    errorSources.push(`Unique constraint violation on ${field?.join(', ')}`);
  } 
  // Handle foreign key constraint violations (P2003)
  else if (err.code === 'P2003') {
    const field = err.meta?.field_name as string;
    message = `Related record not found for ${field}`;
    errorSources.push(`Foreign key constraint violation on ${field}`);
  }
  // Handle record not found (P2001)
  else if (err.code === 'P2001') {
    message = `Record not found`;
    errorSources.push('Record not found');
  }
  // Handle other known Prisma errors
  else {
    message = `Database error: ${err.message}`;
    errorSources.push('Prisma Client Known Request Error');
  }
}
  // Generic Error Handling (e.g., JavaScript Errors)
  else if (err instanceof SyntaxError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Syntax error in the request. Please verify your input.";
    errorSources.push("Syntax Error");
  } else if (err instanceof TypeError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Type error in the application. Please verify your input.";
    errorSources.push("Type Error");
  } else if (err instanceof ReferenceError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Reference error in the application. Please verify your input.";
    errorSources.push("Reference Error");
  }
  // Catch any other error type
  else {
    message = "An unexpected error occurred!";
    errorSources.push("Unknown Error");
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: config.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default GlobalErrorHandler;
