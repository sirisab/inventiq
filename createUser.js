const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const newUser = await prisma.user.create({
    data: {
      name: "Bertil",
      email: "john@example.com",
      password: "abc123",
    },
  });
  console.log("Created user:", newUser);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
