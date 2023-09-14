import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
import "../styles/community.css";

const CustomMenu = React.forwardRef(
  ({ children, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={{ width: "150px", marginTop: "45px" }}
        className={className}
        aria-labelledby={labeledBy}
      >
        <FormControl
          autoFocus
          className="mx-3 my-2 w-75"
          placeholder=""
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) => !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);

export default CustomMenu;
