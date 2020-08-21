import { History } from "history";
import {SPARouter} from "../router";

const GO = "@MIDDLEWARE/GO";
const GOBACK = "@MIDDLEWARE/GO_BACK";
const PUSH = "@MIDDLEWARE/PUSH";


export function go(payload:any){
    return {
        type:GO,
        payload
    }
}

export function goBack(){
    return {
        type:GOBACK
    }
}

export function push(payload:any){
    return {
        type:PUSH
    }
}


export  function createSPARouterMiddleware(spaRouter:SPARouter) {
    return ({getState, dispatch}: {getState: Function; dispatch: Function}) => (
      next: any
    ) => (action: any) => {
      if (GO === action.type) {
        spaRouter.go(action.payload)
      } else if (goBack === action.type) {
        spaRouter.goBack()
      } else if (push === action.type) {
        spaRouter.push(action.payload)
      }
      return next(action);
    };
  }