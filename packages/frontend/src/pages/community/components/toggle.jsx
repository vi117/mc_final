import React from "react";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href="a"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{
      textDecoration: "none",
      color: "#3D8361",
    }}
  >
    {children}
    &#x25bc;
  </a>
));

export default CustomToggle;
