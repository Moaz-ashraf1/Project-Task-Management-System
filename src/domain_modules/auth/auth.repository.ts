import { AppDataSource } from './../../config/database';
import {User} from "../user/user.entity";
import {RefreshToken} from "../auth/refresh-token.entity";

export const authRepository = {
 
  async findUserByEmail(email:string):Promise<User | null>{
    return  AppDataSource.getRepository(User).findOne({where:{email}});
  },

  async findUserByEmailWithPassword (email:string):Promise<User|null>{
    return  AppDataSource.getRepository(User).findOne({where:{email},select:["id","name","email","password" ,"role"]});
  },

  async createRefreshToken(data: Partial<RefreshToken>):Promise<RefreshToken>{
   return AppDataSource.getRepository(RefreshToken).save(data);
  },

  async createUser(data:Partial<User>):Promise<User>{
    return AppDataSource.getRepository(User).save(data);
  },

  async findRefreshToken(tokenHash:string):Promise<RefreshToken|null>{
    return AppDataSource.getRepository(RefreshToken).findOne({where:{tokenHash}});
  },

  async revokeRefreshToken(tokenHash: string): Promise<void> {
    await AppDataSource.getRepository(RefreshToken).update(
      { tokenHash },
      { revoked: true }
    );
  },


  async findUserById(id: string): Promise<User | null> {
    return AppDataSource.getRepository(User).findOne({ where: { id } });
  },

  

}