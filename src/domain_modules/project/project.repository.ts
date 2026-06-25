import {AppDataSource} from "../../config/database";
import {Project} from "./project.entity";
import { CreateProjectDTO, UpdateProjectDTO } from "./project.schema";
export const projectRepository = {
    async findAllProjects(): Promise<Project[]>{
        return AppDataSource.getRepository(Project).find({relations:["owner"]});
    },


    async findProjectById(id:string): Promise<Project|null>{
        return AppDataSource.getRepository(Project).findOne({where:{id},relations:["owner"]})
    },

    async findProjectsByOwnerId(owner_id:string): Promise<Project[]>{
        return AppDataSource.getRepository(Project).find({where:{owner_id},relations:["owner"]});
    },


    async createProject(project:Partial<Project>): Promise<Project>{
        return AppDataSource.getRepository(Project).save(project);
    },

      async updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
      await AppDataSource.getRepository(Project).update({ id }, data);
      return AppDataSource.getRepository(Project).findOne({ where: { id }, relations: ["owner"] });
    },

    async deleteProject(id:string):Promise<void>{
        await AppDataSource.getRepository(Project).delete({ id });
    }
    
}