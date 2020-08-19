import UniversalRouter, { ResolveContext, RouterOptions, Routes, Route, RouteContext, RouteParams, RouteResult, RouterContext } from 'universal-router'
import generateUrls, { UrlParams } from 'universal-router/generateUrls'
import { History, MemoryHistory, LocationState, Location } from 'history';


export interface IRoute<R =any,C extends RouterContext = RouterContext> extends Route{
  component?: (context: RouteContext, params: RouteParams) => RouteResult<R> | any;
  icon?:string;
  preAction?:Function;
  postAction?:Function;
  nested?:Boolean;
  perssion?:()=>Boolean;
  children?:IRoutes<R, C> | null
}

export type IRoutes<R = any, C extends RouterContext = RouterContext> = Array<IRoute<R, C>>;

export default  class Router {
  history: History|MemoryHistory;
  private routerConfig: IRoutes;
  private unConfig: any;
  private router?: UniversalRouter;
  constructor(history: History|MemoryHistory, routerConfig: any,config?: RouterOptions ) {
    this.history = history
    this.routerConfig = routerConfig
    this.unConfig = config
    this.initRouter()
  }
  private initRouter() {
    // const nested=async function(context:RouterContext,params:any){
    //   return [context.route.component(context,params),await context.next()]
    // }
    const universalConfig={
      resolveRoute(context:RouterContext, params:RouteParams) {
        // console.log(context.route.match)
        // if (context.route.nested) {
        //    console.log(context.route.path)
        // //   return nested(context,params)
        //   context.next().then((result:any)=>console.log(result))
        // }
        // console.log(context.route?.preAction())
       
        if ((context.route?.preAction && context.route?.preAction(context,params) || context.route?.preAction ===undefined) && typeof context.route.component === 'function') {
          return context.route.component(context, params)
        // }else{
        //   context.next()
        }
        return undefined
      }
    }
    // console.log({...this.unConfig,...universalConfig}) 
    this.router = new UniversalRouter(this.routerConfig, {...this.unConfig,...universalConfig})
  }
  public matchRoute(pathnameOrContext: string | ResolveContext) {
    return this.router?.resolve(pathnameOrContext)
  }
  public formateRouter(name: string, params?: any) {
    //@ts-ignore
    const url = generateUrls(this.router)
    return url(name, params)
  }

  public addRoute(routes: IRoute) {
    this.router?.root.children?.push(routes)
  }

  public changeHandler(fn: (pathname:string,result:RouteResult<any>)=>any) {
    const self = this

    return new Promise((resolve,reject)=>{
      this.history.listen((location: Location, component: any) => {
        self.router?.resolve({ pathname: location.pathname }).then((result: any) => {
          resolve(fn.call(this, location.pathname, result))
        }).catch((err:Error)=>{
          reject(err)
        })
      });
    })
   
  }

  public go(n: number){
    this.history.go(n)
  }


  public push(path:string,state?:LocationState){
    return this.history.push(path,state)
  }

  public replace(path:string,state?:LocationState){
    return this.history.replace(path,state)
  }

  public goBack(){
    this.history.goBack()
  }

  public goForward(){
    return this.history.goForward()
  }
}
