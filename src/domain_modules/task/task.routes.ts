import { Router } from "express";
import * as taskController from "./task.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "./task.schema";
import { authenticate } from "../../shared/middlewares/authentication.middleware";


const router = Router({ mergeParams: true }); 

router.get("/", authenticate,taskController.getTasksByProject);
router.get("/:id",authenticate, taskController.getTaskById);
router.post("/", authenticate,validate(createTaskSchema), taskController.createTask);
router.put("/:id",authenticate, validate(updateTaskSchema), taskController.updateTask);
router.delete("/:id", authenticate,taskController.deleteTask);

export default router;