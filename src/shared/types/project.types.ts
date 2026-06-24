import {ParamsDictionary} from 'express-serve-static-core';
export  interface ProjectParams extends ParamsDictionary {
  id: string;
}