import http from "http";
import app from "./app";
import { connectDB } from "./DB/connectDB";

const server = http.createServer(app);
const PORT = process.env.PORT || 2000;

async function startServer() {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
  });
}

startServer();
