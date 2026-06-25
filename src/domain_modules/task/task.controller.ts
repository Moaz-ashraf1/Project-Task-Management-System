import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as taskService from "./task.service";
import asyncHandler from "express-async-handler";
import { TaskStatus,TaskPriority } from "./task.entity";

export const getTasksByProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params as { projectId: string };
    const {status,priority} = req.query as {
        status?:TaskStatus,
        priority?:TaskPriority
    };
    const tasks = await taskService.getTasksByProject(projectId, { status, priority });
    res.status(StatusCodes.OK).json({ status: "success", data: { tasks } });
  
});

export const getTaskById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, projectId } = req.params as { id: string; projectId: string };
    const task = await taskService.getTaskById(id, projectId);
    res.status(StatusCodes.OK).json({ status: "success", data: { task } });
  
});

export const createTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params as { projectId: string };
    const task = await taskService.createTask(req.body, projectId, req.userId!);
    res.status(StatusCodes.CREATED).json({ status: "success", data: { task } });

});

export const updateTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
     const { id, projectId } = req.params as { id: string; projectId: string };
    const task = await taskService.updateTask(id, projectId, req.body, req.userId!);
    res.status(StatusCodes.OK).json({ status: "success", data: { task } });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, projectId } = req.params as { id: string; projectId: string };
    await taskService.deleteTask(id, projectId, req.userId!);
    res.status(StatusCodes.OK).json({ status: "success", message: "Task deleted successfully" });
});