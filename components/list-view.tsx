import { useState } from "react";
import { format } from "date-fns";
import { Bookmark, Bug, CheckSquare, CircleDot, Flag, GitPullRequest, Calendar, User, Search, Filter } from "lucide-react";

type ListViewProps = {
  columns: Array<{
    _id: string;
    name: string;
    tasks: Array<any>;
  }>;
  users: Array<{ _id: string; name: string }>;
  onTaskClick: (taskId: string) => void;
};

const priorityConfig = {
  low: { text: "text-sky-600", label: "Low" },
  medium: { text: "text-amber-600", label: "Medium" },
  high: { text: "text-rose-600", label: "High" },
};

const TypeIcon = {
  epic: <Bookmark className="h-4 w-4 text-purple-500" />,
  story: <Bookmark className="h-4 w-4 text-green-500" />,
  task: <CheckSquare className="h-4 w-4 text-blue-500" />,
  bug: <Bug className="h-4 w-4 text-red-500" />,
  subtask: <GitPullRequest className="h-4 w-4 text-slate-500" />
};

export default function ListView({ columns, users, onTaskClick }: ListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("all");

  // Flatten tasks for the list view
  const allTasks = columns.flatMap(col => 
    col.tasks.map(task => ({ ...task, columnName: col.name }))
  );

  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.key && task.key.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAssignee = filterAssignee === "all" || 
                            (filterAssignee === "unassigned" && !task.assignedTo) ||
                            task.assignedTo === filterAssignee;
                            
    return matchesSearch && matchesAssignee;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"
          >
            <option value="all">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border text-xs uppercase font-medium">
            <tr>
              <th className="px-4 py-3 min-w-[300px]">Issue</th>
              <th className="px-4 py-3 w-32">Status</th>
              <th className="px-4 py-3 w-32">Priority</th>
              <th className="px-4 py-3 w-32">Assignee</th>
              <th className="px-4 py-3 w-32">Due Date</th>
              <th className="px-4 py-3 w-24">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No issues found matching your filters.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => {
                const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium;
                const assignedUser = users.find(u => u._id === task.assignedTo);
                
                return (
                  <tr 
                    key={task._id} 
                    onClick={() => onTaskClick(task._id)}
                    className="hover:bg-muted/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 shrink-0">
                          {TypeIcon[task.type as keyof typeof TypeIcon] || <CircleDot className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div>
                          <div className="font-mono text-xs text-muted-foreground mb-0.5">{task.key}</div>
                          <div className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                            {task.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
                        {task.columnName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1.5 ${priority.text}`}>
                        <Flag className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{priority.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {assignedUser ? (
                        <div className="flex items-center gap-1.5">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                            {assignedUser.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                            {assignedUser.name.split(" ")[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {task.dueDate ? (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(task.dueDate), "MMM d")}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {task.storyPoints !== undefined && task.storyPoints !== null ? (
                        <span className="inline-flex items-center justify-center rounded-full bg-muted w-6 h-6 text-xs font-semibold text-muted-foreground">
                          {task.storyPoints}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">--</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
}
