declare module "style-it" {
  import React from "react";

  const Style: {
    it(css: string, children: React.ReactNode): JSX.Element;
  };

  export default Style;
}
