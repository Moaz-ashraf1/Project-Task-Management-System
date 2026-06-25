import { AppDataSource } from "../../config/database";
import { Task, TaskStatus,TaskPriority } from "./task.entity";

export const taskRepository = {
  async findTasksByProjectId(project_id: string , filters?:{status?:TaskStatus,priority?:TaskPriority}): Promise<Task[]> {
    return AppDataSource.getRepository(Task).find({
      where: {
           project_id ,
         ...(filters?.status && { status: filters.status }) ,
          ...(filters?.priority && { priority: filters.priority }) 
        },
      relations: ["assignee"],
    });
  },

  async findTaskById(id: string, project_id: string): Promise<Task | null> {
    return AppDataSource.getRepository(Task).findOne({
      where: { id, project_id },
      relations: ["assignee"],
    });
  },

  async createTask(data: Partial<Task>): Promise<Task> {
    return AppDataSource.getRepository(Task).save(data);
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task | null> {
    await AppDataSource.getRepository(Task).update({ id }, data);
    return AppDataSource.getRepository(Task).findOne({
      where: { id },
      relations: ["assignee"],
    });
  },

  async deleteTask(id: string): Promise<void> {
    await AppDataSource.getRepository(Task).delete({ id });
  },
};