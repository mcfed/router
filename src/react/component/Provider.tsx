import React, { Children, useState } from "react";
import { ReactRoute } from "./RouterView";

export const RouterProvider = React.createContext({} as any);

interface RouteProps {
  router: any;
  children:React.ReactNode;
}

export function ReactRouter(props: RouteProps) {
  return (
    <RouterProvider.Provider value={{ router: props.router }}>
      {
        props.children
      }
    </RouterProvider.Provider>
  );
}

// interface SPAProviderProp {
//   spaRouter: SPARouter;
//   children: React.ReactNode;
// }

// export function SPAProvider(prop: SPAProviderProp) {
//   // const child = Children.only(prop.children)
//   // console.log(child)
//   /*
//   return (<SPAProviderContext.Provider value={prop.spaRouter}>
//         {
//           //@ts-ignore
//           React.createElement(child.type,{spaRouter:prop.spaRouter})
//         }
//         </SPAProviderContext.Provider>)
//         */

//   return <RouterView spaRouter={prop.spaRouter}></RouterView>
// }
