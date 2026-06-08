import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
export const prisma = new PrismaClient({ adapter, log: ["query"] });
prisma.$connect().then(() => {
  console.log("Connected to database");
});
export default prisma;
