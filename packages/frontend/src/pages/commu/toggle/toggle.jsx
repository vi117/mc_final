import React from "react";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href="a"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{ textDecoration: "none", color: "black" }}
  >
    {children}
    &#x25bc;
  </a>
));

export default CustomToggle;
