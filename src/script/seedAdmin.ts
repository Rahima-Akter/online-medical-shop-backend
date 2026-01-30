import { prisma } from "../lib/prisma";

async function seedAdmin() {
  const adminInfo = {
    name: "Srity",
    email: "srity@admin.com",
    role: "ADMIN",
    password: "password1234",
    date_of_birth: "1999-07-31T00:00:00.000Z",
    default_shipping_address: "123 Health Ave, Wellness City, FL 33101, USA",
  };

  try {
    const isExists = await prisma.user.findUnique({
      where: { email: adminInfo.email },
    });
    if (isExists) {
      console.log("Admin already exists, skipping seeding.");
      return;
    }

    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:5000",
        },
        body: JSON.stringify(adminInfo),
      },
    );

    const data = await signUpAdmin.json();

    if (!signUpAdmin.ok) {
      throw new Error(JSON.stringify(data));
    }

    // console.log("**** Admin created");
    await prisma.user.update({
      where: { email: adminInfo.email },
      data: { emailVerified: true },
    });
    // console.log("Admin email verified ✅");
  } catch (err) {
    console.log("something went wrong in seedAdmin():\n", err);
  }
}

seedAdmin();
