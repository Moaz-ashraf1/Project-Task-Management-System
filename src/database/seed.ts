import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "../config/database";
import { User, UserRole } from "../domain_modules/user/user.entity";
import { Project, ProjectStatus } from "../domain_modules/project/project.entity";
import { Task, TaskStatus, TaskPriority } from "../domain_modules/task/task.entity";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const seed = async () => {
  await AppDataSource.initialize();
  console.log("✅ Database connected");

  await AppDataSource.query(`TRUNCATE TABLE tasks, projects, users RESTART IDENTITY CASCADE`);
   console.log("🗑️ Existing data cleared");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // ── Users (100) ──
  const userRepo = AppDataSource.getRepository(User);

  const users: User[] = [];

  // admin واحد ثابت
  const admin = userRepo.create({
    name: "Moaz Admin",
    email: "admin@test.com",
    password: hashedPassword,
    role: UserRole.ADMIN,
  });
  users.push(admin);

  // 99 member عشوائي
  for (let i = 0; i < 99; i++) {
    users.push(
      userRepo.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: UserRole.MEMBER,
      })
    );
  }

  await userRepo.save(users);
  console.log(`✅ ${users.length} users created`);

  // ── Projects (50) ──
  const projectRepo = AppDataSource.getRepository(Project);
  const projects: Project[] = [];

  for (let i = 0; i < 50; i++) {
    const randomOwner = users[Math.floor(Math.random() * users.length)];
    projects.push(
      projectRepo.create({
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(Object.values(ProjectStatus)),
        owner_id: randomOwner.id,
      })
    );
  }

  await projectRepo.save(projects);
  console.log(`✅ ${projects.length} projects created`);

  // ── Tasks (500) ──
  const taskRepo = AppDataSource.getRepository(Task);
  const tasks: Task[] = [];

  for (let i = 0; i < 500; i++) {
    const randomProject = projects[Math.floor(Math.random() * projects.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const isAssigned = Math.random() > 0.3; // 70% assigned

    tasks.push(
      taskRepo.create({
        title: faker.hacker.phrase(),
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(Object.values(TaskStatus)),
        priority: faker.helpers.arrayElement(Object.values(TaskPriority)),
        dueDate: faker.date.future(),
        project_id: randomProject.id,
        assignee_id: isAssigned ? randomUser.id : null,
      })
    );
  }

  await taskRepo.save(tasks);
  console.log(`✅ ${tasks.length} tasks created`);

  console.log("🎉 Seed completed!");
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});