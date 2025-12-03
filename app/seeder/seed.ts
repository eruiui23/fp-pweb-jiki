import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { hashPassword } from "../../lib/password";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data
  console.log("Clearing existing data...");
  await prisma.tracker.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  console.log("👥 Seeding users...");
  const hashedPass1 = await hashPassword("password123");
  const hashedPass2 = await hashPassword("password456");
  const hashedPass3 = await hashPassword("password789");

  const users = await prisma.user.createMany({
    data: [
      {
        usn: "user001",
        email: "user001@example.com",
        pass: hashedPass1,
      },
      {
        usn: "user002",
        email: "user002@example.com",
        pass: hashedPass2,
      },
      {
        usn: "user003",
        email: "user003@example.com",
        pass: hashedPass3,
      },
    ],
  });
  console.log(`Created ${users.count} users`);

  // Seed Tasks
  console.log("Seeding tasks...");
  const tasks = await prisma.task.createMany({
    data: [
      {
        task_name: "Complete project proposal",
        due_date: new Date("2025-12-15"),
        userId: "user001",
      },
      {
        task_name: "Review code changes",
        due_date: new Date("2025-12-10"),
        userId: "user001",
      },
      {
        task_name: "Update documentation",
        due_date: new Date("2025-12-20"),
        userId: "user002",
      },
      {
        task_name: "Bug fixing and testing",
        due_date: new Date("2025-12-12"),
        userId: "user002",
      },
      {
        task_name: "Deploy to production",
        due_date: new Date("2025-12-25"),
        userId: "user003",
      },
    ],
  });
  console.log(`Created ${tasks.count} tasks`);

  // Seed Trackers
  console.log("Seeding trackers...");
  const trackers = await prisma.tracker.createMany({
    data: [
      {
        tracker_type: "development",
        duration: 480, // 8 hours in minutes
        userId: "user001",
      },
      {
        tracker_type: "testing",
        duration: 120, // 2 hours in minutes
        userId: "user001",
      },
      {
        tracker_type: "documentation",
        duration: 90, // 1.5 hours in minutes
        userId: "user002",
      },
      {
        tracker_type: "meeting",
        duration: 60, // 1 hour in minutes
        userId: "user002",
      },
      {
        tracker_type: "review",
        duration: 45, // 45 minutes
        userId: "user003",
      },
      {
        tracker_type: "deployment",
        duration: 30, // 30 minutes
        userId: "user003",
      },
    ],
  });
  console.log(`Created ${trackers.count} trackers`);

  console.log("Database seeding completed successfully!");
}

main()
  .catch((error) => {
    console.error("Seeding error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
