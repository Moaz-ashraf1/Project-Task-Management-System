import { taskRepository } from "./task.repository";
import * as projectService from '../project/project.service';
import { ApiError } from "../../shared/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { CreateTaskDTO, UpdateTaskDTO } from "./task.schema";
import { ProjectNotFoundError } from "../project/exceptions/ProjectNotFoundError";
import { TaskNotFoundError } from "./exceptions/TaskNotFoundError";
import { ProjectOwnerForbiddenError } from "../project/exceptions/ProjectOwnerForbiddenError";
import { TaskStatus,TaskPriority } from "./task.entity";

export const getTasksByProject = async (projectId: string, filters?:{status?:TaskStatus,priority?:TaskPriority}) => {
  const project = await projectService.getProjectById(projectId);
  if (!project) throw new ProjectNotFoundError();

  return taskRepository.findTasksByProjectId(projectId,filters);
};

export const getTaskById = async (id: string, projectId: string) => {
  const task = await taskRepository.findTaskById(id, projectId);
  if (!task) throw new TaskNotFoundError();
  return task;
};

export const createTask = async (
  data: CreateTaskDTO,
  projectId: string,
  userId: string
) => {
   const project = await projectService.getProjectById(projectId);
   if (!project) throw new ProjectNotFoundError();

  if (project.owner_id !== userId) {
    throw new ProjectOwnerForbiddenError();
  }

  return taskRepository.createTask({ ...data, project_id: projectId ,dueDate: data.dueDate ? new Date(data.dueDate) : null,});
};

export const updateTask = async (
  id: string,
  projectId: string,
  data: UpdateTaskDTO,
  userId: string
) => {
  const task = await taskRepository.findTaskById(id, projectId);
  if (!task) throw new TaskNotFoundError();

 const project = await projectService.getProjectById(projectId);
  if (project?.owner_id !== userId) {
    throw new ProjectOwnerForbiddenError();
  }

  return taskRepository.updateTask(id, {
  ...data,
  dueDate: data.dueDate ? new Date(data.dueDate) : null,
});
};

export const deleteTask = async (
  id: string,
  projectId: string,
  userId: string
) => {
  const task = await taskRepository.findTaskById(id, projectId);
  if (!task) throw new ApiError(StatusCodes.NOT_FOUND, "Task not found");

  const project = await projectService.getProjectById(projectId);
  if (project?.owner_id !== userId) {
    throw new ProjectOwnerForbiddenError();
  }

  await taskRepository.deleteTask(id);
};