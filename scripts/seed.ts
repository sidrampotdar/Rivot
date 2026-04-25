import mongoose from "mongoose";
import connectDB from "../lib/db.ts";
import {
  User,
  Board,
  Workspace,
  Column,
  Task,
  Project,
  Comment,
} from "../models/index.ts";

const usersData = [
  {
    clerkId: "user_3CnjDOcZrMzN3whYzjPRIuqDcma",
    email: "sidramappapotdar@gmail.com",
    name: "Sidramappa Potdar",
    avatar: null,
    password: null,
    workspaces: [],
  },
  {
    clerkId: "user_3Co9SqNlg2DefeoJbwPHaCyN3b7",
    email: "potdarsidramappa@gmail.com",
    name: "S potdar",
    avatar: null,
    password: null,
    workspaces: [],
  },
  {
    clerkId: "user_3CoAENmb6JalM6jEQS6zLwcN7gt",
    email: "sidrampotdar200517@gmail.com",
    name: "Sidram  Potdar",
    avatar: null,
    password: null,
    workspaces: [],
  },
];

const workspaceData = [
  {
    name: "Sidramappa Team",
    ownerIndex: 0,
    memberIndices: [0, 1, 2],
  },
];

const projectsData = [
  {
    name: "Workspace Kickoff",
    description: "Initial setup and team onboarding for the workspace",
  },
  {
    name: "Client Onboarding",
    description: "Complete client integration and training program",
  },
  {
    name: "Website Redesign",
    description: "Complete redesign of company website with new branding",
  },
  {
    name: "Mobile App MVP",
    description: "Build minimum viable product for mobile application",
  },
  {
    name: "API Integration",
    description: "Integrate third-party payment and analytics APIs",
  },
];

const taskTitles = [
  "Setup workspace structure",
  "Add team members",
  "Create initial project board",
  "Write kickoff notes",
  "Review scope",
  "Assign first tasks",
  "Add comments to tasks",
  "Finalize sprint plan",
  "Design mockups",
  "Code implementation",
  "Testing and QA",
  "Deploy to staging",
  "Deploy to production",
  "Monitor performance",
  "Gather feedback",
];

const columnNames = ["To Do", "In Progress", "Done"];
const priorities = ["low", "medium", "high"] as const;

function randomDateInFuture(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + Math.ceil(Math.random() * days));
  return date;
}

async function clearDatabase() {
  console.log("🧹 Clearing database...");
  await Promise.all([
    User.deleteMany({}),
    Workspace.deleteMany({}),
    Project.deleteMany({}),
    Board.deleteMany({}),
    Column.deleteMany({}),
    Task.deleteMany({}),
    Comment.deleteMany({}),
  ]);
}

async function seed() {
  try {
    await connectDB();
    console.log("🌱 Seeding database...");

    await clearDatabase();

    const users = await User.insertMany(usersData);
    console.log(`👤 Users created: ${users.length}`);

    const workspaces = await Workspace.insertMany(
      workspaceData.map((workspace) => ({
        name: workspace.name,
        ownerId: users[workspace.ownerIndex]._id,
        members: workspace.memberIndices.map((index) => users[index]._id),
      })),
    );
    console.log(`🏢 Workspaces created: ${workspaces.length}`);

    await User.bulkWrite(
      workspaces.flatMap((workspace) =>
        workspace.members.map((memberId) => ({
          updateOne: {
            filter: { _id: memberId },
            update: { $addToSet: { workspaces: workspace._id } },
          },
        })),
      ),
    );
    console.log("🧩 User workspace links updated");

    let projectCount = 0;
    let boardCount = 0;
    let columnCount = 0;
    let taskCount = 0;
    let commentCount = 0;

    for (const workspace of workspaces) {
      const projects = await Project.insertMany(
        projectsData.map((project) => ({
          name: project.name,
          description: project.description,
          workspaceId: workspace._id,
          createdBy: workspace.ownerId,
          ownerId: workspace.ownerId,
        })),
      );
      projectCount += projects.length;

      for (const project of projects) {
        const board = await Board.create({
          name: "Project Board",
          projectId: project._id,
        });
        boardCount++;

        const columns = await Column.insertMany(
          columnNames.map((name, index) => ({
            name,
            boardId: board._id,
            order: index,
          })),
        );
        columnCount += columns.length;

        const tasks = taskTitles.map((title, index) => {
          const column = columns[index % columns.length];
          const assignee = users[index % users.length];
          const creator = users[(index + 1) % users.length];

          return {
            title,
            description: `${title} for ${project.name}`,
            columnId: column._id,
            boardId: board._id,
            assignedTo: assignee._id,
            priority: priorities[index % priorities.length],
            order: index,
            createdBy: creator._id,
            dueDate: randomDateInFuture(14),
          };
        });

        const createdTasks = await Task.insertMany(tasks);
        taskCount += createdTasks.length;

        const comments = createdTasks.flatMap((task, index) => [
          {
            taskId: task._id,
            userId: users[index % users.length]._id,
            content: `Please review the ${task.title.toLowerCase()} task.`,
          },
          {
            taskId: task._id,
            userId: users[(index + 1) % users.length]._id,
            content: `I updated the progress on ${task.title.toLowerCase()}.`,
          },
        ]);

        const createdComments = await Comment.insertMany(comments);
        commentCount += createdComments.length;
      }
    }

    console.log("✅ Seed complete");
    console.log({
      users: users.length,
      workspaces: workspaces.length,
      projects: projectCount,
      boards: boardCount,
      columns: columnCount,
      tasks: taskCount,
      comments: commentCount,
    });
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 DB disconnected");
  }
}

seed();
