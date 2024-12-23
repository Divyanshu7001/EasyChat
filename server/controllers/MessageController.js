import ErrorHandler from "../middlewares/errorMiddleware.js";
import getPrismaInstance from "../utils/PrismaClient.js";
import { renameSync } from "fs";
export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { message, from, to } = req.body;
    if (!message || !from || !to) {
      return next(new ErrorHandler("Provide necessary Details", 401));
    }
    const getUser = onlineUsers.get(to);

    if (message && from && to) {
      const newMessage = await prisma.messages.create({
        data: {
          message,
          sender: { connect: { id: from } },
          reciever: { connect: { id: to } },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: { sender: true, reciever: true },
      });
      if (!newMessage) {
        return next(
          new ErrorHandler("Problem while creating new Message", 501)
        );
      }
      return res.status(201).json({
        status: 201,
        message: "Message Created",
        message: newMessage,
      });
    } else {
      return next(new ErrorHandler("Error while creating Message", 501));
    }
  } catch (error) {
    return next(new ErrorHandler(`Error While adding Message: ${error}`, 501));
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { from, to } = req.params;

    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: from,
            recieverId: to,
          },
          {
            senderId: to,
            recieverId: from,
          },
        ],
      },
      orderBy: {
        id: "asc",
      },
    });

    if (!messages) {
      return next(new ErrorHandler("Messages couldnt be fetched", 501));
    }

    const unreadMessages = [];

    messages.forEach((message, index) => {
      if (message.messageStatus !== "read" && message.senderId === to) {
        messages[index].messageStatus = "read";
        unreadMessages.push(message.id);
      }
    });

    await prisma.messages.updateMany({
      where: {
        id: { in: unreadMessages },
      },
      data: {
        messageStatus: "read",
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Messages fetched",
      messages,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Error while Fetching Messages: ${error}`, 501)
    );
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    console.log("in try");
    console.log(req.file);
    
    if(req.file) {
      const date = Date.now();
      let filename = "uploads/images/" + date + req.file.originalname;
      renameSync(req.file.path, filename);
      const prisma = getPrismaInstance();
      const { from, to } = req.query;
      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: filename,
            sender: { connect: { id: from } },
            reciever: { connect: { id: to } },
            type: "image",
          },
        });
        return res.status(200).json({
          success: true,
          message: "Image Uploaded sucessfully",
          message,
        });
      }
      return next(new ErrorHandler("From & to is required", 400));
    }
    return next(new ErrorHandler("File is required", 401));
  } catch (error) {
    return next(new ErrorHandler(`Error While uploading Image: ${error}`, 502));
  }
};
