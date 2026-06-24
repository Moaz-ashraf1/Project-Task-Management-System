import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as projectService from "./project.service";
import asyncHandler from "express-async-handler";
import {ProjectParams} from '../../shared/types/project.types';
import {UpdateProjectDTO} from './project.schema';

export const getAllProjects =asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    const projects = await projectService.getAllProjects();
    res.status(StatusCodes.OK).json({ status: "success", data: { projects } });
});

export const getProject = asyncHandler(async (req: Request<ProjectParams>, res: Response, next: NextFunction) => {
    const project = await projectService.getProjectById(req.params.id!);
    res.status(StatusCodes.OK).json({ status: "success", data: { project } });

});
export const createProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const project = await projectService.createProject(req.body, req.userId!);
    res.status(StatusCodes.CREATED).json({ status: "success", data: { project } });
  
});

export const updateProject = asyncHandler(
  async (req: Request<ProjectParams, any, UpdateProjectDTO>, res: Response, next: NextFunction) => {
    const project = await projectService.updateProject(req.params.id, req.body, req.userId!);
    res.status(StatusCodes.OK).json({ status: "success", data: { project } });
  }
);
export const deleteProject = asyncHandler(async (req: Request<ProjectParams>, res: Response, next: NextFunction) => {
    await projectService.deleteProject(req.params.id!, req.userId!);
    res.status(StatusCodes.OK).json({ status: "success", message: "Project deleted successfully" });
});