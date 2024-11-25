import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Container, Button, Row } from "react-bootstrap";
import * as Yup from "yup";
import {
  TextInput,
  ListInput,
  Select,
  FileUpload,
  DateTimePicker,
} from "./Form";

function ComponentShowcase() {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "Text Input Example",
      component: (
        <TextInput
          label="Sample Text Input"
          name="textInput"
          type="text"
          placeholder="Enter text here"
          infoicon="This is a sample text input field"
          subtext="This is some helper text below the input"
          md="6"
        />
      ),
    },
    {
      title: "List Input Example",
      component: (
        <ListInput
          label="List Input"
          name="listInput"
          placeholder="Enter list item"
        />
      ),
    },
    {
      title: "List Input Example password",
      component: (
        <ListInput label="List Input" name="listInput" placeholder="*****" />
      ),
    },
    {
      title: "Select Example",
      component: (
        <Select
          label="Sample Select"
          name="select"
          options={["Option 1", "Option 2", "Option 3"]}
          infoicon="This is a sample select field"
          placeholder="Choose an option"
          md="6"
        />
      ),
    },
    // {
    //   title: "File Upload Example",
    //   component: <FileUpload label="Upload File" name="fileUpload" />,
    // },
    {
      title: "DateTime Example",
      component: (
        <DateTimePicker label="Select Date and Time" name="dateTime" md={6} />
      ),
    },
  ];

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  // Add handleSubmit function
  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form submitted with values:", values);
    // Add your submission logic here
    alert("Form submitted successfully!");
    setSubmitting(false);
  };

  return (
    <Container className="mt-5">
      <Formik
        initialValues={{
          textInput: "",
          listInput: "",
          select: "",
          fileUpload: "",
          dateTime: null,
        }}
        validationSchema={Yup.object({
          textInput: Yup.string().required("Required"),
        })}
        onSubmit={handleSubmit} // Connect the handleSubmit function
      >
        {({ isSubmitting }) => (
          <Form>
            <h2>{pages[currentPage].title}</h2>
            <Row className="mb-4">{pages[currentPage].component}</Row>

            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentPage === 0}
              >
                Previous
              </Button>

              {currentPage === pages.length - 1 ? (
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={currentPage === pages.length - 1}
                >
                  Next
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-3 text-center">
        Page {currentPage + 1} of {pages.length}
      </div>
    </Container>
  );
}

export default ComponentShowcase;
