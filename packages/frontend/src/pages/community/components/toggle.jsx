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
      color: "#A2A2A2",
    }}
  >
    {children}
    &#x25bc;
  </a>
));

export default CustomToggle;
