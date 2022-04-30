import { Request } from "express";
import { EmailVerification } from "../../../../models";

import { userRepo } from "../../../../repositories";

export const emailVerificationController = async ({ body }: Request) => {
  const { email, vCode } = body;

  /// FInding the email and vcode in the database
  let userFound = await userRepo.findUserByQuery({
    where: {
      email,
      emailVerified: false,
    },
    include: [
      {
        model: EmailVerification,
        as: "emailVerification",
        where: {
          verified: false,
        },
        required: false,
      },
    ],
  });

  /// Checking if valid user
  if (!userFound) {
    return {
      error: "Invalid email or verification code",
      status: 400,
    };
  } else {
    userFound = userFound.toJSON();
  }

  /// Checking that the verification code exists
  let emailVerification =
    userFound.emailVerification && userFound.emailVerification[0];

  if (!emailVerification) {
    return {
      error: "Invalid email or verification code",
      status: 400,
    };
  }

  /// Checking that the vcode is valid
  let isValidCode = String(emailVerification.vCode) === String(vCode);

  if (!isValidCode) {
    return {
      error: "Invalid email or verification code",
      status: 400,
    };
  }

  // Checking if already verified
  if (userFound.emailVerified && isValidCode) {
    return {
      error: "Your email is already verified",
      status: 400,
    };
  }


   // UPdating the database
  await Promise.all([
    await userRepo.updateUser(
      { emailVerified: true },
      {
        where: { id: userFound.id },
      }
    ),
    await EmailVerification.update(
      { verified: true },
      {
        where: {
          vCode,
          userId: userFound.id,
        },
      }
    ),
  ]);

  /// Returns success to the client
  return {
    message: "Your email has been verified",
    data: {
      id: userFound.id,
      email: userFound.email,
      username: userFound.username,
    },
  };
};
