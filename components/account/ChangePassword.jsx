import UsersApiService from "@/services/apis/usersApiService";
import { selectToken } from "@/services/store/tokenSlice";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as Yup from "yup";

export default function ChangePassword({ ...props }) {
  const router = useRouter();
  const [changePasswordError, setChangePasswordError] = useState("");
  const token = useSelector(selectToken);

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  }

  const schema = Yup.object().shape({
    oldPassword: Yup.string().required("Your old password is required").max(50),
    newPassword: Yup.string().required("Your new password is required").max(50),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required("You need to confirm your new password")
  });

  const handleSubmit = async (values = initialValues, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const response = await UsersApiService.changePassword(token, values);
      // console.log(response);
      router.push("/account?view=profile");
    }
    catch (error) {
      setChangePasswordError(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  return (<div className="ChangePassword">
    <Card className="my-4 mx-auto shadow" style={{maxWidth: '540px'}}>
      <Card.Header>
        <h1 className="cardHeader">Change Password</h1>
      </Card.Header>
      <Container className="p-3">
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          validateOnBlur={true}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isValid ,isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Old Password</Form.Label>
                <Form.Control 
                  type="password" 
                  name="oldPassword"
                  value={values.oldPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.oldPassword && errors.oldPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.oldPassword}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control 
                  type="password" 
                  name="newPassword" 
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.newPassword && errors.newPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                  type="password" 
                  name="confirmPassword" 
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.confirmPassword && errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit" className="d-block mx-auto" disabled={!isValid || isSubmitting}>
                Submit
              </Button>
              {changePasswordError !== "" && <Alert variant="danger" className="mt-3">{changePasswordError}</Alert>}
            </Form>
          )}
        </Formik>
      </Container>
    </Card>
  </div>);
}