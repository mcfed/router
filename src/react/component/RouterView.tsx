import React, { useState, useContext } from "react";
import { Location } from "history";
import { RouterProvider } from "./Provider";

export function ReactRoute() {
  const [routerComp, setRouterComp] = useState();
  const router = useContext(RouterProvider);

  function compileComponent(component: any) {
    if (!component) {
      return null;
    }
    if (typeof component === "function") {
      return React.createElement(component.type, {
        ...component.props,
        spaRouter: router,
      });
    }
    return component;
  }

  router.subscribe((result: any, location: Location) => {
    setRouterComp(result);
  });
  return compileComponent(routerComp);
}
