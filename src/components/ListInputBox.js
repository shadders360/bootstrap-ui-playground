import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Form, InputGroup, Button } from "react-bootstrap";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import "bootstrap/dist/css/bootstrap.min.css";

import { useField, useFormikContext } from "formik";

import PropTypes from "prop-types";

const ListInputBox = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and also replace ErrorMessage entirely.
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();
  const [allowReset, setAllowReset] = useState(false);
  const { name } = props;

  function handleReset(e) {
    e.preventDefault();
    setAllowReset(false);
    setFieldValue(name, "*****");
  }
  return (
    <>
      <Form.Group as={Col} md="12" controlId={name}>
        <InputGroup>
          <InputGroup.Text style={{ width: 100, textAlign: "right" }}>
            {label}
          </InputGroup.Text>

          <Form.Control
            isInvalid={!!meta.touched && !!meta.error}
            {...field}
            {...props}
            onFocus={(e) => {
              if (e.target.value === "*****") {
                setFieldValue(name, "");
                setAllowReset(true);
              }
            }}
          />
          {allowReset ? (
            <InputGroup.Append>
              <Button variant="outline-secondary" onClick={handleReset}>
                reset
              </Button>
            </InputGroup.Append>
          ) : null}

          <Form.Control.Feedback type="invalid">
            {meta.error}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
    </>
  );
};

ListInputBox.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
};

export default ListInputBox;
