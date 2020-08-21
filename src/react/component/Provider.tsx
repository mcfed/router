import React, { Children } from 'react'
import { SPARouter } from '../../router';
import { RouterView } from './RouterView';


// export const SPAProviderContext = React.createContext({});


interface SPAProviderProp {
  spaRouter: SPARouter;
  children: React.ReactNode;
}

export function SPAProvider(prop: SPAProviderProp) {
  // const child = Children.only(prop.children)
  // console.log(child)
  /*
  return (<SPAProviderContext.Provider value={prop.spaRouter}>
        { 
          //@ts-ignore
          React.createElement(child.type,{spaRouter:prop.spaRouter})
        }
        </SPAProviderContext.Provider>)
        */

  return <RouterView spaRouter={prop.spaRouter}></RouterView>
}
