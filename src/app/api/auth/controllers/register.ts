import { hash } from "bcrypt";
import { Request } from "express";
import { EmailVerification } from "../../../../models";

import { userRepo } from "../../../../repositories";
import { sendVerificationEMail } from "../../../../services/network/email";

export const registerController = async ({ body }: Request) => {
  const { username, password, email } = body;

  /// Checking if the email or the username already exists
  let [emailFound, usernameFound] = await Promise.all([
    await userRepo.findUserByEmail(email),
    await userRepo.findByUsername(username),
  ]);

  if (emailFound)
    return {
      error: "Email alreay exists",
      status: 400,
    };

  if (usernameFound)
    return {
      error: "Username alreay exists",
      status: 400,
    };

  // Hashing the password
  let hashedPassword = await hash(password, 10);

  /// Generating the verification code to be sent to the email
  let vCode = String(Math.floor(Math.random() * 90000) + 10000);


  /// Inserting the new user to the database
  let newUser = await userRepo.createNewUser({
    username,
    password: hashedPassword,
    email,
    emailVerified: false,
  });

  /// Sending the verification code
  if (newUser.id) {
    sendVerificationEMail({ email, code: vCode });
    await EmailVerification.create({
      vCode,
      userId: newUser.id,
      verified: false,
    });
  }

  /// Returns success to the client
  return {
    data: {
      email,
      username,
    },
    message:
      "Signed up successfully, Please check your email inbox to verify your account",
  };
};
