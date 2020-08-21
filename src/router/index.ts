import UniversalRouter, { ResolveContext, RouterOptions,  Route, RouteContext, RouteParams, RouteResult, RouterContext } from 'universal-router'
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

/**
 * 单应用路由
 */
export  class SPARouter {
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
  /**
   * 初始化路由对象
   */
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
        console.log("route",context,params) 
       
        if ((context.route?.preAction && context.route?.preAction(context,params) || context.route?.preAction ===undefined) && typeof context.route.component === 'function') {
          return context.route.component(context, params)
        }
        return undefined
      }
    }
    // console.log({...this.unConfig,...universalConfig}) 
    this.router = new UniversalRouter(this.routerConfig, {...this.unConfig,...universalConfig})
  }
  /**
   * @deprecated
   * @param pathnameOrContext 
   */
  public matchRoute(pathnameOrContext: string | ResolveContext) {
    return this.router?.resolve(pathnameOrContext)
  }
  public formateRouter(name: string, params?: any) {
    //@ts-ignore
    const url = generateUrls(this.router)
    return url(name, params)
  }

  /**
   *  动态添加路由
   * @param routes 
   */
  public addRoute(routes: IRoute) {
    this.router?.root.children?.push(routes)
  }

  /**
   * 历史监听方法
   * @param fn 监听回调方式
   */
  public changeHandler(fn: (result:RouteResult<any>,location:Location)=>any) {
    const self = this

    return new Promise((resolve,reject)=>{
      this.history.listen((location: Location, component: any) => {
        self.router?.resolve({ pathname: location.pathname }).then((result: any) => {
          resolve(fn.call(this,result,location))
        }).catch((err:Error)=>{
          reject(err)
        })
      });
    })
   
  }

  /**
   * 回退历史
   * @param n number
   */
  public go(n: number){
    this.history.go(n)
  }


  /**
   * 推进新历史
   * @param path 
   * @param state
   * @todo path 改为 path.name 自动调用转换路由 this.formateRouter 
   */
  public push(path:string,state?:LocationState){
    
    return this.history.push(path,state)
  }

  /**
   * 替换历史
   * @param path  路径
   * @param state 状态
   */
  public replace(path:string,state?:LocationState){
    return this.history.replace(path,state)
  }

  /**
   * 回退历史
   */
  public goBack(){
    this.history.goBack()
  }

  /**
   * 前进历史
   */
  public goForward(){
    return this.history.goForward()
  }
}
