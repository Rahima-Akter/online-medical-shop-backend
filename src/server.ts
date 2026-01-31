import express, { Request, Response } from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { medicineRouter } from "./modules/medicine/medicine.route";
import { categoryRouter } from "./modules/category/category.route";
import { reviewRouter } from "./modules/review/review.route";
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5000"],
    credentials: true,
  }),
);
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/", (req: Request, res: Response) => {
  res.send("server is running");
});

app.use('/api/medicine', medicineRouter)
app.use('/api/category', categoryRouter)
app.use('/api/review', reviewRouter)


// since CUSTOMER & SELLER role can be chosen while register that why we have to force our own register route to be able to create an account that prevents from choosing ADMIN as role
app.post("/register", express.json(), async (req, res) => {
  const {
    email,
    password,
    name,
    role,
    date_of_birth,
    default_shipping_address,
  } = req.body;

  // Only allow CUSTOMER or SELLER
  if (!["CUSTOMER", "SELLER"].includes(role)) {
    return res.status(400).json({ error: "Role must be CUSTOMER or SELLER" });
  }

  try {
    // Sign up via BetterAuth
    const result = await fetch("http://localhost:5000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:5000", //
      },
      body: JSON.stringify({
        email,
        password,
        name,
        date_of_birth,
        default_shipping_address,
        role, // send role here
      }),
    });

    const data = await result.json();

    res.json({ message: "User registered successfully", data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    app.listen(port, async () => {
      console.log(`server is running on port: http://localhost:${port}`);
    });
  } catch (err) {
    console.log("server connenction faild", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
