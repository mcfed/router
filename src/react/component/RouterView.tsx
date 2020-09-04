import React, { Component, useContext, useState } from "react";
import { SPARouter } from "../../router";
// import {SPAProviderContext} from "./Provider"
import { RouteResult } from "universal-router";


interface IRouterViewProps {
  spaRouter?:SPARouter
}


export function RouterView(props:IRouterViewProps){
  // const context= useContext(SPAProviderContext)
  const [aaa] = useState(0)
  // const [component,setComponent] = useState(0)
  // props?.spaRouter?.subscribe((path: string, result: RouteResult<any>) => {
  //   setComponent(result)
  // })
  return (<div>1111</div>)
}

