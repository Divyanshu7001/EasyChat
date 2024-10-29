import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import { Server } from "socket.io";
const app = express();
app.use(morgan("combined"));
app.use(
  cors({
    origin: true,
    Access-Control-Allow-Origin: *,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json({ limit: "20kb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads/images", express.static("uploads/images"));

app.use("/api/auth", AuthRoutes);
app.use("/api/messages", MessageRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log("Server is Lisyening on PORT: ", process.env.PORT);
});

const io = new Server(server, {
  cors: {
    origin: "https://easychat-mauve.vercel.app",
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", {
        from: data.from,
        message: data.message,
      });
    }
  });
});

app.use(errorMiddleware);
