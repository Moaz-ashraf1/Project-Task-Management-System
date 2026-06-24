import { Router } from "express";
import * as projectController from "./project.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { authenticate } from "../../shared/middlewares/authentication.middleware";
import { createProjectSchema, updateProjectSchema } from "./project.schema";

const router = Router();


router.get("/", authenticate,projectController.getAllProjects);
router.get("/:id",authenticate, projectController.getProject);
router.post("/", authenticate,validate(createProjectSchema), projectController.createProject);
router.put("/:id", authenticate,validate(updateProjectSchema), projectController.updateProject);
router.delete("/:id", authenticate,projectController.deleteProject);

export default router;