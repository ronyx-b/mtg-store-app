import UsersApiService from "@/services/apis/usersApiService";
import useUserProfile from "@/services/cache/useUserProfile";
import { selectToken } from "@/services/store/tokenSlice";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as Yup from "yup";

/** @typedef {import("@/types").Address} Address */
/**
 * @callback SetNewAddress
 * @param {string} id
 * @returns {void}
 */
/**
 * Modal to add or edit an Address
 * @param {Object} props
 * @param {string} props.editAddressId
 * @param {SetNewAddress} props.setNewAddress
 * @param {boolean} props.showAddressModal
 * @param {Function} props.handleModalClose
 * @returns {JSX.Element}
 */
export default function ManageAddressModal({ editAddressId = null, setNewAddress, showAddressModal, handleModalClose, ...props }) {
  const token = useSelector(selectToken);
  const userProfile = useUserProfile(token);
  const [submissionError, setSubmissionError] = useState("");

  const editAddressInitialValues = editAddressId !== null ? 
    userProfile.data?.address.find((thisAddress) => thisAddress._id === editAddressId) : null;

  /** @type {Address & { makeDefaultAddress: boolean }} */
  const emptyInitialValues = {
    name: userProfile.data?.name,
    street: "",
    city: "",
    province: "",
    postal: "",
    makeDefaultAddress: false,
  };

  const formik = useFormik({
    initialValues: editAddressId !== null ? { 
      ...editAddressInitialValues, 
      makeDefaultAddress: false,
    } : emptyInitialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string().required().max(50),
      street: Yup.string().required().max(50),
      city: Yup.string().required().max(20),
      province: Yup.string().required().max(20),
      postal: Yup.string().required().max(10),
      makeDefaultAddress: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        /** @type {import("axios").AxiosResponse} */
        let response;
        if (editAddressId !== null) {
          response = await UsersApiService.editAddress(token, { ...values, _id: editAddressId });
        } else {
          response = await UsersApiService.addAddress(token, values);
        }
        if (response.status !== 200 && response.status !== 201) {
          throw response.data.message;
        }
        let copiedValues = { ...values };
        delete copiedValues.makeDefaultAddress;
        /** @type {Address} */
        let updatedAddress = { ...copiedValues, _id: response.data.addressId ? response.data.addressId : editAddressId };
        const updatedUserAddressList = [ ...userProfile.data?.address, updatedAddress ];
        userProfile.mutate({ ...userProfile.data, address: updatedUserAddressList });
        setNewAddress(updatedAddress);
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
          ...userProfile.data?.address.find(
            (thisAddress) => thisAddress._id == editAddressId
          )
        });
      })();
    } else {
      formik.resetForm({ values: emptyInitialValues });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editAddressId, showAddressModal]);

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
          <Form.Group className="mb-3" controlId="formManageAddress.name">
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
          <Form.Group className="mb-3" controlId="formManageAddress.street">
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
            <Form.Group as={Col} md="4" controlId="formManageAddress.city">
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
              controlId="formManageAddress.province"
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
            <Form.Group as={Col} md="4" controlId="formManageAddress.postal">
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
          {userProfile.data?.defaultAddress === editAddressId ? <>
            <Row>
              <Col>
                This is your <strong>default address</strong>  
              </Col>
            </Row>
          </> : <>
            <Form.Group className="mb-3" controlId="formManageAddress.makeDefaultAddress">
              <Form.Check
                  type="checkbox"
                  name="makeDefaultAddress"
                  label="Make this your default address"
                  checked={formik.getFieldProps("makeDefaultAddress").value}
                  onChange={(e) => {
                    formik.setFieldValue("makeDefaultAddress", e.target.checked);
                  }}
                  isInvalid={formik.touched.makeDefaultAddress && formik.errors.makeDefaultAddress}
                />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </>}
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