import React, { useState, useEffect } from "react";
import { Form, FormControl } from "react-bootstrap";

export default function Textinput({
  title,
  subTitle,
  onChange,
  name,
  value,
  disabled,
}) {
  return (
    <div>
      <Form.Group className="text-start mb-4">
        <Form.Label>{title}</Form.Label>
        <p> {subTitle}</p>
        <FormControl
          type="text"
          as="textarea"
          row={3}
          disabled={!onChange || disabled ? true : false}
          name={name}
          onChange={onChange}
          value={value}
        />
      </Form.Group>
    </div>
  );
}
