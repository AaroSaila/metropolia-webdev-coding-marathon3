import { useState } from "react";

export default function useField(type, required = false, accept = "") {
  const [value, setValue] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const fieldProps = { type, value, onChange, required }

if (type === "file" && accept) {
  fieldProps.accept = accept;
}

return fieldProps;
};