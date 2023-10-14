import jwt, { Secret } from "jsonwebtoken";
import path from "path";
import ejs from "ejs";
import { Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncErrors";
import UserModel from "../../models/user";
import sendEmail from "../../utils/sendMail";
import { BadRequestError } from "../../utils/ErrorHandler";

const ACTIVATION_SECRET = process.env.ACTIVATION_SECRET;

interface IRegBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registerUser = CatchAsyncError(async function (
  req: Request,
  res: Response
) {
  try {
    const { name, email, password } = req.body;

    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      throw new BadRequestError("Email already Exist");
    }
    const user: IRegBody = {
      name,
      email,
      password,
    };

    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const data = { user: { name: user.name }, activationCode };
    console.log(activationCode);

    await ejs.renderFile(
      path.join(__dirname, "../../mails/activation-mail.ejs"),
      data
    );

    try {
      await sendEmail({
        email: user.email,
        subject: "Account Activation",
        template: "activation-mail.ejs",
        data,
      });
      res.status(201).json({
        success: true,
        message: `Please Check Your email: ${user.email} to activate your account`,
        activationToken: activationToken.token,
      });
    } catch (error: any) {
      // throw new Error(`${error.message}`);
      console.log(error);
    }
  } catch (error: any) {
    // throw new BadRequestError(`${error.message}`);
    console.log(error);
  }
});

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = generateOTP();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    ACTIVATION_SECRET as Secret,
    {
      expiresIn: "10m",
    }
  );
  return { token, activationCode };
};

function generateOTP(): string {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp.toString();
}
