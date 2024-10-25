import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/errorMiddleware.js";
import getPrismaInstance from "../utils/PrismaClient.js";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    //console.log(email);

    if (!email) {
      return next(new ErrorHandler("Email is Required credential", 401));
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({
        success: false,
        message: "User not Found",
      });
    }
    return res.status(200).json({
      status: 201,
      success: true,
      message: "User Found",
      user,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Error While Checking the User: ${error}`, 501)
    );
  }
};

export const onboardUser = async (req, res, next) => {
  try {
    console.log("In Function");

    const { email, name, about, image: profilePicture } = req.body;
    if (!email || !name || !about || !profilePicture) {
      return next(new ErrorHandler("Provide all the Details", 401));
    }
    const prisma = getPrismaInstance();
    const createduser = await prisma.user.create({
      data: { email, name, about, profilePicture },
    });
    console.log("after creation");

    console.log(createduser);

    if (!createduser) {
      return next(new ErrorHandler("Error while creating User", 501));
    }
    console.log("Before return");

    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      data: createduser,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Error while Registering User: ${error}`, 502)
    );
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        about: true,
      },
    });

    if (!users) {
      return next(new ErrorHandler("Error While Fetching Users", 501));
    }

    const usersGroupByInitialLetter = {};
    users.forEach((user) => {
      const initialLetter = user.name.charAt(0).toUpperCase();
      if (!usersGroupByInitialLetter[initialLetter]) {
        usersGroupByInitialLetter[initialLetter] = [];
      }
      usersGroupByInitialLetter[initialLetter].push(user);
    });

    return res.status(201).json({
      status: 201,
      message: "Users fetched successfully",
      usersGroupByInitialLetter,
    });
  } catch (error) {}
};
