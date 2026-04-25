import { getProjectBoardData } from "@/lib/projects";
import ProjectPageClient from "./project-page-client";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const data = await getProjectBoardData(projectId);

  // Serialize data for client
  const serializedData = {
    project: {
      _id: data.project._id.toString(),
      name: data.project.name,
      description: data.project.description,
    },
    board: {
      _id: data.board._id.toString(),
    },
    columns: data.columns.map((col) => ({
      _id: col._id.toString(),
      name: col.name,
      order: col.order,
      tasks: col.tasks.map((task) => ({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        assignedTo: task.assignedTo?.toString(),
      })),
    })),
  };

  return <ProjectPageClient data={serializedData} />;
}
