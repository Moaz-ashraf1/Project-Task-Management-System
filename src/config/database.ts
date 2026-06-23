import {DataSource  } from "typeorm";
import {env} from "./env";

import { User } from "../domain_modules/user/user.entity";
import { Project } from "../domain_modules/project/project.entity";
import { Task } from "../domain_modules/task/task.entity";

export const AppDataSource = new DataSource({
    type:"postgres",
    url: env.DATABASE_URL,
    entities:[],
    synchronize:env.NODE_ENV === "development",
    logging:env.NODE_ENV === "development",

})