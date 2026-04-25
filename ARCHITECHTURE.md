# 🚀 Project Architecture & System Flow

---

# 🧠 1. COMPLETE SYSTEM (Big Picture)

You are building:

User → Workspace → Project → Board → Column → Task → Comment  
 ↓  
 ActivityLog

Each level has a purpose. This is a **hierarchical workflow system**.

---

# 🧩 2. DATA MODELS (What each does)

---

## 👤 User

### Purpose:

Represents a person using your app.

### Key Fields:

- `clerkId` → authentication identity
- `workspaces[]` → workspaces user belongs to

### Meaning:

👉 A user can be in **multiple workspaces**

---

## 🏢 Workspace

### Purpose:

Team / organization container

### Key Fields:

- `ownerId`
- `members[]`

### Meaning:

👉 Workspace = team  
👉 Multiple users collaborate here

---

## 📁 Project

### Purpose:

Logical grouping of work inside a workspace

### Key Fields:

- `workspaceId`
- `ownerId`
- `createdBy`

### Meaning:

👉 Projects belong to a workspace  
👉 Example: “Hackathon App”, “Startup MVP”

---

## 📋 Board

### Purpose:

Kanban board inside project

### Key Field:

- `projectId`

👉 Each project can have multiple boards (currently using 1)

---

## 📊 Column

### Purpose:

Stages of work

### Examples:

- To Do
- In Progress
- Done

### Key Fields:

- `boardId`
- `order`

---

## 📝 Task (🔥 MOST IMPORTANT ENTITY)

### Purpose:

Actual work item

### Key Fields:

- `columnId`
- `boardId` (redundant but useful for fast queries)
- `assignedTo`
- `priority`
- `order`

👉 This is what users interact with most

---

## 💬 Comment

### Purpose:

Discussion on tasks

### Key Fields:

- `taskId`
- `userId`

---

## 📜 ActivityLog (🔥 PRO FEATURE)

### Purpose:

Track all actions

### Examples:

- Task moved
- User assigned
- Comment added

---

# 🧠 3. DATA FLOW (CRITICAL)

---

## 🟦 Show Board UI

Project  
↓  
Board  
↓  
Columns  
↓  
Tasks

---

## 🟪 Show Task Details

Task  
↓  
Comments  
↓  
Activity Logs

---

# 🔥 4. COMPLETE ACTION FLOW

---

## 🟢 STAGE 1: USER ONBOARDING

### Actions:

#### 1. Create User

- via Clerk
- store in DB

#### 2. Create Workspace

### Also:

- Add user to `members[]`
- Add workspace to `user.workspaces[]`

---

## 🟡 STAGE 2: PROJECT CREATION

### Action:

### What happens:

1. Create Project
2. Create Board
3. Create Columns

✅ Already implemented

---

## 🔵 STAGE 3: BOARD USAGE (CORE)

---

### 🧩 Create Task

### DB Fields:

- title
- columnId
- boardId
- createdBy

---

### 🔄 Move Task (VERY IMPORTANT)

### Updates:

- columnId
- order

### Also log:

---

### 👤 Assign Task
