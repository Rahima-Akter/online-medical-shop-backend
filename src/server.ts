import express, { Request, Response } from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
const app = express();
const port = process.env.PORT || 5000;

// app.use(
//   cors({
//     origin: [],
//     credentials: true,
//   }),
// );
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("server is running");
});

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    app.listen(port, () => {
      console.log(`server is running on port: http://localhost:${port}`);
    });
  } catch (err) {
    console.log("server connenction faild", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
