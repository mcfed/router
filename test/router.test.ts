import { createHashHistory, createMemoryHistory, createBrowserHistory, History, Location } from 'history'
import {SPARouter,IRoute, IRoutes } from '../src/router/index'
import { RouterContext, Route, RouteResult } from 'universal-router';

let hashHistory: History = createHashHistory({
  basename: '', // The base URL of the app (see below)
  hashType: 'slash', // The hash type to use (see below)
  // A function to use to confirm navigation with the user (see below)
});

describe('universal router 构造', () => {

  let routerConfig: IRoute = {
    path: "",
    children: [
      {
        path: '/app', // optional, matches both "/posts" and "/posts/"
        name: "app",
        component: () => `app`,
      },
      {
        path: '/:id',
        name: "",
        component: (context: RouterContext) => `${context.params.id}`,
      },
    ],
  }
  it('universal router', (done) => {
    const router = new SPARouter(hashHistory, routerConfig)
    router.subscribe(( result: any,location:Location) => {
      expect(result).toBe("app")
      // console.log(location)
      done()
    })
    router.push(router.formateRouter("app"))
  });

  it('router with param', (done) => {
    const router = new SPARouter(hashHistory, routerConfig)
    router.subscribe((result: any,location:Location) => {
      expect(result).toBe("abc")
      done()
    })
    router.push("/abc")
  })

  it("dynamic add routes", (done) => {
    const router = new SPARouter(hashHistory, routerConfig)
    router.subscribe((result: any,location:Location) => {
      expect(result).toBe("dashboard")
      done()
    })

    router.addRoute({
      path: "/dashboard",
      name: "dashboard",
      component: () => "dashboard"
    })

    router.addRoute({
      path: "/users/:id",
      name: "user.id",
      component: (context: RouterContext) => `users is :${context.params.id}`
    })

    router.push("/dashboard")
  })
  it("dynamic add routes with param", (done) => {
    const router = new SPARouter(hashHistory, routerConfig)
    router.subscribe((result: any,location:Location) => {
      expect(result).toBe("users is :abc")
      done()
    })

    router.addRoute({
      path: "/users/:id",
      component: (context: RouterContext) => `users is :${context.params.id}`
    })

    router.push("/users/abc")
  })
})


describe.skip('router nested', () => {
  let routerConfig: IRoute = {
    path: "",
    children: [
      {
        path: '/app', // optional, matches both "/posts" and "/posts/"
        name: "app",

        component: () => `app->`,
        children: [{
          path: '/dashboard',
          name: "app.dashboard",
          component: (context: RouterContext) => "dashboard",
          // nested:true,
          children: [{
            path: "/detail",
            nested: true,
            name: "app.dashboard.detail",
            component: (contet: RouterContext) => "detail"
          }]
        }]
      }
    ]
  }
  it('router nested', (done) => {
    const router = new SPARouter(hashHistory, routerConfig)
    router.subscribe((result: any,location:Location) => {
      expect(result).toEqual(["app->", "dashboard"])
      done()
    })
    router.push(router.formateRouter("app.dashboard.detail"))
  })

})

describe('preAction', () => {
  let routerConfig: IRoutes = [{
    path: "",
    children: [
      {
        path: '/app', // optional, matches both "/posts" and "/posts/"
        name: "app",
        preAction: () => true,
        component: () => `app`,
      }]
  },
  {
    path: '/dashboard',
    name: "dashboard",
    preAction: () => false,
    component: (context: RouterContext) => "dashboard",
    // nested:true,
    children: [{
      path: "/detail",
      // nested: true,
      name: "dashboard.detail",
      component: (contet: RouterContext) => "detail"
    }]
  },{
    path:"/profile",
    name:"profile",
    component:(context:RouterContext) => "profile"
  }]
  it('preAction is undefined', (done) => {
    const router = new SPARouter(hashHistory, routerConfig)
    router.subscribe((result: any,location:Location) => {
      expect(result).toEqual("profile")
      done()
    })
    router.push(router.formateRouter("profile"))
  })
  it("preAction have preAction true app ", (done) => {
    const router = new SPARouter(hashHistory, routerConfig)
    router.subscribe((result: any,location:Location) => {
      expect(result).toEqual("app")
      done()
    })
    router.push(router.formateRouter("app"))
  })


  it("preAction have preAction false dashboard ", (done) => {
    const router = new SPARouter(hashHistory, routerConfig)
    router.subscribe((result: any,location:Location) => {
    
    }).catch((error:Error)=>{
      expect(error.message).toEqual("Route not found")
      done()
    })
    router.push(router.formateRouter("dashboard"))
  })


})




