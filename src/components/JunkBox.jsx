import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Form as BootstrapForm, Button, Container } from "react-bootstrap";
import { TextInput } from "./components/Form";
import ListInputBox from "./components/ListInputBox";
const ValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  street: Yup.string()
    .min(7, "street must be at least 7 characters")
    .required("street is required"),
});

const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Log the form values
    console.log("Form values:", values);

    // You would typically make your API call here
    // await axios.post('/api/submit', values);

    // Optional: Reset the form after successful submission
    resetForm();

    // Optional: Show success message
    alert("Form submitted successfully!");
  } catch (error) {
    // Handle any errors
    console.error("Submission error:", error);
    alert("Error submitting form!");
  } finally {
    // Make sure to set submitting to false
    setSubmitting(false);
  }
};
const SimpleForm = () => {
  const initialValues = {
    username: "",
    email: "",
    street: "",
    overseas: "",
  };

  return (
    <Container className="mt-5">
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <>
            <Form>
              <BootstrapForm.Group className="mb-3">
                <BootstrapForm.Label>Username</BootstrapForm.Label>
                <Field
                  as={BootstrapForm.Control}
                  type="text"
                  name="username"
                  isInvalid={touched.username && errors.username}
                />
                <BootstrapForm.Control.Feedback type="invalid">
                  <ErrorMessage name="username" />
                </BootstrapForm.Control.Feedback>
              </BootstrapForm.Group>

              <BootstrapForm.Group className="mb-3">
                <BootstrapForm.Label>Email</BootstrapForm.Label>
                <Field
                  as={BootstrapForm.Control}
                  type="email"
                  name="email"
                  isInvalid={touched.email && errors.email}
                />
                <BootstrapForm.Control.Feedback type="invalid">
                  <ErrorMessage name="email" />
                </BootstrapForm.Control.Feedback>
              </BootstrapForm.Group>

              <TextInput
                name="street"
                infoicon="Help text"
                subtext="more details can be found at www.info.com"
                label="enter street same as billing address"
              />
              <ListInputBox label="Test Label" name="overseas" />

              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Form>
          </>
        )}
      </Formik>
    </Container>
  );
};

export default SimpleForm;
