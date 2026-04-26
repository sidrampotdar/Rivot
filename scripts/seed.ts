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
    role: "admin",
    workspaces: [],
  },
  {
    clerkId: "user_3Co9SqNlg2DefeoJbwPHaCyN3b7",
    email: "potdarsidramappa@gmail.com",
    name: "S potdar",
    avatar: null,
    password: null,
    role: "employee",
    workspaces: [],
  },
  {
    clerkId: "user_3CoAENmb6JalM6jEQS6zLwcN7gt",
    email: "sidrampotdar200517@gmail.com",
    name: "Sidram Potdar",
    avatar: null,
    password: null,
    role: "employee",
    workspaces: [],
  },
];

const workspaceData = [
  {
    name: "Rivot HQ",
    ownerIndex: 0,
    memberIndices: [0, 1, 2],
  },
  {
    name: "Design Studio",
    ownerIndex: 0,
    memberIndices: [0, 2],
  },
];

const projectsData = [
  {
    name: "Website Redesign v2.0",
    description: "Complete overhaul of the marketing site using Next.js 14 and TailwindCSS. Focus on performance and conversion rate optimization.",
    workspaceIndex: 0,
  },
  {
    name: "Mobile App MVP",
    description: "Initial React Native build for the iOS and Android applications. Target release for Q3.",
    workspaceIndex: 0,
  },
  {
    name: "API V3 Migration",
    description: "Migrating from legacy REST endpoints to the new GraphQL architecture to improve payload efficiency.",
    workspaceIndex: 0,
  },
  {
    name: "Q2 Marketing Campaign",
    description: "Assets and planning for the upcoming product launch campaign across all social channels.",
    workspaceIndex: 1,
  },
  {
    name: "Brand Identity Refresh",
    description: "Updating logos, typography, and color palettes to match the new minimalist aesthetic.",
    workspaceIndex: 1,
  },
];

const taskTitles = [
  "Setup CI/CD pipeline",
  "Design landing page mockup",
  "Write database schema",
  "Implement authentication flow",
  "Create UI component library",
  "Optimize image assets",
  "Write end-to-end tests",
  "Configure monitoring alerts",
  "Review pull requests",
  "Deploy to staging environment",
  "Gather user feedback",
  "Fix mobile responsiveness bugs",
  "Update documentation",
  "Plan next sprint",
  "Conduct performance audit",
  "Integrate payment gateway",
  "Design email templates",
  "Setup analytics tracking",
  "Create onboarding tutorial",
  "Refactor legacy code",
];

const columnNames = ["Backlog", "To Do", "In Progress", "In Review", "Done"];
const priorities = ["low", "medium", "high"] as const;

function randomDateInFuture(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + Math.ceil(Math.random() * days));
  return date;
}

const commentTemplates = [
  "I've started working on this. Will update by end of day.",
  "Can someone review the PR I just linked?",
  "We are blocked by the API team on this one.",
  "Design looks great, moving to development.",
  "Found a bug while testing. Check the attached screenshots.",
  "This is a high priority item. Let's finish it this sprint.",
  "Closing this task as it's no longer relevant.",
  "I need more clarification on the requirements.",
  "LGTM! Feel free to merge.",
  "Deployed to staging. Please verify.",
];

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

    const projects = await Project.insertMany(
      projectsData.map((project) => ({
        name: project.name,
        description: project.description,
        workspaceId: workspaces[project.workspaceIndex]._id,
        createdBy: users[0]._id, // Admin created all projects
        ownerId: users[0]._id,
      })),
    );
    projectCount = projects.length;

    for (const project of projects) {
      const board = await Board.create({
        name: `${project.name} Board`,
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

      // Assign 8-12 random tasks to each project
      const numTasks = Math.floor(Math.random() * 5) + 8;
      const projectTasks = [];
      
      for (let i = 0; i < numTasks; i++) {
        const title = taskTitles[Math.floor(Math.random() * taskTitles.length)];
        const column = columns[Math.floor(Math.random() * columns.length)];
        // Get valid users for this workspace
        const workspaceDoc = workspaces.find(w => w._id.toString() === project.workspaceId.toString());
        const validUserIds = workspaceDoc?.members || [users[0]._id];
        
        const assigneeId = validUserIds[Math.floor(Math.random() * validUserIds.length)];
        const creatorId = users[0]._id; // Admin created

        projectTasks.push({
          title,
          description: `Detailed description for ${title}. This task requires coordination with the team to ensure all edge cases are handled properly.`,
          columnId: column._id,
          boardId: board._id,
          assignedTo: assigneeId,
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          order: i,
          createdBy: creatorId,
          dueDate: randomDateInFuture(21),
        });
      }

      const createdTasks = await Task.insertMany(projectTasks);
      taskCount += createdTasks.length;

      const comments = [];
      for (const task of createdTasks) {
        // 0-3 comments per task
        const numComments = Math.floor(Math.random() * 4);
        for (let c = 0; c < numComments; c++) {
          const workspaceDoc = workspaces.find(w => w._id.toString() === project.workspaceId.toString());
          const validUserIds = workspaceDoc?.members || [users[0]._id];
          const commenterId = validUserIds[Math.floor(Math.random() * validUserIds.length)];
          
          comments.push({
            taskId: task._id,
            userId: commenterId,
            content: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
          });
        }
      }

      if (comments.length > 0) {
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
