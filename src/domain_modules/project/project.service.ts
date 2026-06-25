import * as projectRepo from "./project.repository";
import { ApiError } from "../../shared/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { CreateProjectDTO, UpdateProjectDTO } from "./project.schema";
import { ProjectNotFoundError } from "./exceptions/ProjectNotFoundError";
import { ProjectOwnerForbiddenError } from "./exceptions/ProjectOwnerForbiddenError";

export const getAllProjects = async (userId: string) => {
  return await projectRepo.projectRepository.findProjectsByOwnerId(userId);
};

export const getProjectById = async (id: string) => {
  const project = await projectRepo.projectRepository.findProjectById(id);
  if (!project)   throw new ProjectNotFoundError();
  return project;
};

export const createProject = async (
  data: CreateProjectDTO,
  ownerId: string
) => {
  return projectRepo.projectRepository.createProject({ ...data, owner_id: ownerId });
};

export const updateProject = async (
  id: string,
  data: UpdateProjectDTO,
  userId: string
) => {
  const project = await  projectRepo.projectRepository.findProjectById(id);
  if (!project) throw new ProjectNotFoundError();

 if (project.owner_id !== userId) {
  throw new ProjectOwnerForbiddenError();
}

  return  projectRepo.projectRepository.updateProject(id, data);
};

export const deleteProject = async (id: string, userId: string) => {
  const project = await  projectRepo.projectRepository.findProjectById(id);
  if (!project) throw new ProjectNotFoundError();

  if (project.owner_id !== userId) {
      throw new ProjectOwnerForbiddenError();
  }

  await  projectRepo.projectRepository.deleteProject(id);
};