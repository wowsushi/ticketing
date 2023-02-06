import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError, RequestValidationError, validateRequest } from "@btticket/common";
import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const curUser = await User.findOne({ email });

    if (!curUser) {
      throw new BadRequestError();
    }

    const passwordMatch = await Password.compare(curUser.password, password)
    // console.log(passwordMatch)
    if (!passwordMatch) {
      throw new BadRequestError();
    }

    const userJwt = jwt.sign(
        {
          id: curUser.id,
          email: curUser.email,
        },
        process.env.JWT_KEY!
      );
  
      req.session = {
        jwt: userJwt,
      };
  
    res.status(200).send({});
  }
);

export { router as signinRouter };
