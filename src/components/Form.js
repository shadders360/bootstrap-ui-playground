import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Form, InputGroup, Button } from "react-bootstrap";
import { useField, useFormikContext } from "formik";
import { Storage } from "aws-amplify";
import kuuid from "kuuid";
import { Tooltip as BSTooltip } from "react-bootstrap";
import { OverlayTrigger } from "react-bootstrap";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "react-bootstrap/ProgressBar";
import Datetime from "react-datetime";
import PropTypes from "prop-types";

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const { name, infoicon, subtext, md } = props;

  return (
    <>
      <Form.Group as={Col} md={md || "12"} controlId={name}>
        <Form.Label>
          {label}
          &nbsp;
          <OverlayTrigger
            delay={{ hide: 450, show: 300 }}
            overlay={(props) => <BSTooltip {...props}>{infoicon}</BSTooltip>}
            placement="bottom"
          >
            <span data-testid="tooltip-trigger" className="info-icon-wrapper">
              <FontAwesomeIcon icon={faInfoCircle} size="sm" color="#797d80" />
            </span>
            {/* <FontAwesomeIcon icon={faInfoCircle} size="sm" color="#797d80" /> */}
          </OverlayTrigger>
        </Form.Label>
        <InputGroup>
          <Form.Control
            isInvalid={!!meta.touched && !!meta.error}
            {...field}
            {...props}
          />
          <Form.Control.Feedback type="invalid">
            {meta.error}
          </Form.Control.Feedback>
        </InputGroup>
        {subtext && <Form.Text className="text-muted">{subtext}</Form.Text>}
      </Form.Group>
    </>
  );
};

TextInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  infoicon: PropTypes.string,
  subtext: PropTypes.string,
  md: PropTypes.string,
};

export const ListInput = ({ label, ...props }) => {
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
              <Button variant="outline-primary" onClick={handleReset}>
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

ListInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
};

const Select = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const {
    name,
    infoicon,
    options,
    changeDeployments,
    subtext,
    md,
    placeholder,
  } = props;

  return (
    <Form.Group as={Col} md={md || "12"} controlId={name}>
      <Form.Label>{label}</Form.Label>
      &nbsp;
      <OverlayTrigger
        delay={{ hide: 450, show: 300 }}
        overlay={(props) => <BSTooltip {...props}>{infoicon}</BSTooltip>}
        placement="bottom"
      >
        <FontAwesomeIcon icon={faInfoCircle} size="sm" color="#797d80" />
      </OverlayTrigger>
      <InputGroup>
        <Form.Control
          isInvalid={!!meta.touched && !!meta.error}
          {...field}
          {...props}
          as="select"
        >
          {placeholder && (
            <option key="placeholder" value="">
              {placeholder}
            </option>
          )}
          {options.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {meta.error}
        </Form.Control.Feedback>
      </InputGroup>
      {changeDeployments && (
        <Form.Text className="text-muted">
          Changing the deployment will duplicate this item.
        </Form.Text>
      )}
      {subtext && <Form.Text className="text-muted">{subtext}</Form.Text>}
    </Form.Group>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  infoicon: PropTypes.string,
  options: PropTypes.array,
  changeDeployments: PropTypes.string,
  subtext: PropTypes.string,
  md: PropTypes.string,
  placeholder: PropTypes.string,
};

const FileUpload = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and alse replace ErrorMessage entirely.
  const [field, meta] = useField(props);
  const { name } = props;
  const [progress, setProgress] = useState(0);
  const { setFieldValue } = useFormikContext();

  return (
    <>
      <Form.Group as={Col} md="12" controlId={name}>
        <InputGroup>
          <Form.Control
            isInvalid={!!meta.touched && !!meta.error}
            {...field}
            {...props}
            type="hidden"
          />
        </InputGroup>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text style={{ width: 100, textAlign: "right" }}>
              {label}
            </InputGroup.Text>
          </InputGroup.Prepend>

          <Form.File
            custom
            label="click to upload"
            onChange={(e) => {
              const file = e.target.files[0];
              const s3objectName = `${e.target.id}-${kuuid.id()}`;
              Storage.put(s3objectName, file, {
                level: "public", /// its not really public - the bucket is locked down
                tagging: `name=${s3objectName}`,
                progressCallback: (p) => {
                  setProgress(Math.floor((p.loaded / p.total) * 100));
                },
              })
                .then(() => {
                  setFieldValue(name, `#s3#${s3objectName}`);
                })
                .catch(() => {
                  setProgress(0);
                });
            }}
          />
          <Form.Control.Feedback type="invalid">
            {meta.error}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group as={Col} md="12" key={`${name}-progress`}>
        <ProgressBar now={progress} label={`${progress}%`} />
      </Form.Group>
    </>
  );
};

FileUpload.propTypes = {
  label: PropTypes.object,
  name: PropTypes.string,
};

const ToolTip = ({ label }) => {
  return (
    <OverlayTrigger
      delay={{ hide: 450, show: 300 }}
      overlay={(props) => <BSTooltip {...props}>{label}</BSTooltip>}
      placement="bottom"
    >
      <FontAwesomeIcon icon={faInfoCircle} size="sm" color="#797d80" />
    </OverlayTrigger>
  );
};

ToolTip.propTypes = {
  label: PropTypes.string,
};

const DateTimePicker = ({ label, ...props }) => {
  const { name, md, "data-testid": dataTestId } = props;
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);

  return (
    <>
      <Form.Group
        as={Col}
        md={md || "12"}
        controlId={name}
        data-testid={dataTestId}
      >
        <Form.Label>{label}</Form.Label>
        <Datetime
          {...field}
          {...props}
          selected={(field.value && new Date(field.value)) || null}
          onChange={(val) => {
            setFieldValue(field.name, val);
          }}
          inputProps={{ placeholder: !field.value && "Please select" }}
          value={(field.value && new Date(field.value)) || null}
          dateFormat="D-M-YY"
          timeFormat="HH:mm:ss"
        />
        {meta.error && meta.touched ? (
          <div className="error-feedback">{meta.error}</div>
        ) : (
          <div />
        )}
      </Form.Group>
    </>
  );
};

DateTimePicker.propTypes = {
  label: PropTypes.object,
  name: PropTypes.string,
  md: PropTypes.number,
  "data-testid": PropTypes.string,
};

export { Select, TextInput, FileUpload, ToolTip, DateTimePicker };
