import UsersApiService from "@/services/apis/usersApiService";
import useUserProfile from "@/services/cache/useUserProfile";
import { selectToken } from "@/services/store/tokenSlice";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as Yup from "yup";

/**
 * Modal to add or edit an Address
 * @param {Object} props
 * @param {string} props.editAddressId
 * @param {Function} props.setEditAddressId
 * @param {boolean} props.showAddressModal
 * @param {Function} props.handleModalClose 
 * @returns {JSX.Element}
 */
export default function ManageAddressModal({ editAddressId = "", setEditAddressId, showAddressModal, handleModalClose, ...props }) {
  const token = useSelector(selectToken);
  const accountInfo = useUserProfile(token);
  const [submissionError, setSubmissionError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: accountInfo.data?.name,
      street: "",
      city: "",
      province: "",
      postal: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required().max(50),
      street: Yup.string().required().max(50),
      city: Yup.string().required().max(20),
      province: Yup.string().required().max(20),
      postal: Yup.string().required().max(10),
    }),
    onSubmit: async (values) => {
      try {
        let response;
        if (editAddressId !== null) {
          response = await UsersApiService.editAddress(token, { ...values, _id: editAddressId });
        } else {
          response = await UsersApiService.addAddress(token, values);
        }
        if (response.status !== 200 && response.status !== 201) {
          throw response.data.message;
        }
        accountInfo.mutate();
        // console.log("Submitted:", values);
        handleModalClose();
      } catch (err) {
        setSubmissionError(err);
        // console.log(`Error: ${err}`);
      }
    },
  });

  useEffect(() => {
    if (editAddressId !== null) {
      (async () => {
        await formik.setValues({
          ...accountInfo.data?.address.find(
            (thisAddress) => thisAddress._id == editAddressId
          ),
        });
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editAddressId]);

  return (
    <Modal
      size="lg"
      show={showAddressModal}
      onHide={() => {
        if (!formik.isSubmitting) {
          handleModalClose();
        }
      }}
      {...props}
    >
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Modal.Header>
          <Modal.Title>{editAddressId ? "Edit" : "Add"} Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formRegister.name">
            <Form.Label>Full Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              {...formik.getFieldProps("name")}
              isInvalid={formik.touched.name && formik.errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRegister.street">
            <Form.Label>Street:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Street name, number, Apt/Suite, ..."
              name="street"
              {...formik.getFieldProps("street")}
              isInvalid={formik.touched.street && formik.errors.street}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.street}
            </Form.Control.Feedback>
          </Form.Group>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="formRegister.city">
              <Form.Label>City:</Form.Label>
              <Form.Control
                type="text"
                name="city"
                {...formik.getFieldProps("city")}
                isInvalid={formik.touched.city && formik.errors.city}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.city}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="4"
              controlId="formRegister.province"
            >
              <Form.Label>Province:</Form.Label>
              <Form.Control
                type="text"
                name="province"
                {...formik.getFieldProps("province")}
                isInvalid={formik.touched.province && formik.errors.province}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.province}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="formRegister.postal">
              <Form.Label>Postal Code:</Form.Label>
              <Form.Control
                type="text"
                placeholder="A1A 2B2"
                name="postal"
                {...formik.getFieldProps("postal")}
                isInvalid={formik.touched.postal && formik.errors.postal}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.postal}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {submissionError !== "" && (
            <Row>
              <Col>
                <Alert variant="danger" className="mt-3">
                  {submissionError}
                </Alert>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            type="reset"
            onClick={handleModalClose}
            disabled={formik.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}