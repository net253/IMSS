import React from "react";
import { Form, FormControl } from "react-bootstrap";

export default function Selecter({
  labels,
  options,
  onChange,
  name,
  inputForm,
  otherChange,
  value,
  disabled,
  inputOther,
}) {
  return (
    <div>
      <Form.Group className="text-start mb-4">
        <Form.Label>{labels}</Form.Label>
        <Form.Select
          disabled={!onChange || disabled ? true : false}
          name={name}
          onChange={onChange}
        >
          {options.map((info, i) => (
            <option key={i} value={info.value}>
              {info.label}
            </option>
          ))}
        </Form.Select>
        {inputForm == "other" && (
          <FormControl
            className="mt-2"
            name={name}
            onChange={otherChange}
            value={inputOther}
          />
        )}
      </Form.Group>
    </div>
  );
}
