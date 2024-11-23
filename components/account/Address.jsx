import UsersApiService from "@/services/apis/usersApiService";
import useUserProfile from "@/services/cache/useUserProfile";
import { selectToken } from "@/services/store/tokenSlice";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Card, Col, Form, Modal, Row, Spinner, } from "react-bootstrap";
import { useSelector } from "react-redux";
import ManageAddressModal from "./ManageAddressModal";

export default function Address({ ...props }) {
  const router = useRouter();
  const token = useSelector(selectToken);
  const userProfile = useUserProfile(token);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [showConfirmDeleteAddressModal, setShowConfirmDeleteAddressModal] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleModalClose = () => {
    setShowAddressModal(false);
    setEditAddressId(null);
  };

  const handleDeleteAddress = async () => {
    try {
      setIsDeleting(true);
      const response = await UsersApiService.deleteAddress(token, { addressId: deleteAddressId });
      if (response.status === 200) {
        const deleteAddressIndex = userProfile.data?.address.findIndex((thisAddress) => thisAddress._id === deleteAddressId);
        console.log(`delete address at index: ${deleteAddressIndex}`);
        if (deleteAddressIndex >= 0) {
          const updatedUserAddressList = [ ...userProfile.data?.address ];
          updatedUserAddressList.splice(deleteAddressIndex, 1);
          console.log("updated user address list: ", updatedUserAddressList);
          userProfile.mutate({ ...userProfile.data, address: updatedUserAddressList });
        }
      }
      setShowConfirmDeleteAddressModal(false);
      setDeleteAddressId(null);
    }
    catch (err) {
      console.log(`Error: ${err}`);
    }
    finally {
      setIsDeleting(false);
    }
  };

  /** @type {React.FormEventHandler} */
  const handleChangeDefaultAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await UsersApiService.updateDefaultAddress(token, { addressId: e.target.value });
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      userProfile.mutate();
    }
    catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  return (
    <div className="Address">
      <Row xs={1} md={1} lg={1} xl={1}>
        <Col>
          <Button onClick={() => {setShowAddressModal(true)}}>
            <i class="bi bi-plus-lg" /> Add new Address
          </Button>
        </Col>
      </Row>
      <Row xs={1} md={2} lg={3} xl={3}>
        {userProfile.isLoading ? (
          <>
            <Spinner
              animation="border"
              role="status"
              style={{ display: "block", margin: "5rem auto" }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </>
        ) : (
          <>
            {userProfile.data.address.map((thisAddress, i) => (
              <Col key={i} style={{ marginTop: "1rem" }}>
                <Card className="shadow">
                  <Card.Body>
                    <Row>
                      <p>
                        {thisAddress.name}
                        <br />
                        {thisAddress.street}
                        <br />
                        {thisAddress.city}, {thisAddress.province}, {thisAddress.postal}
                      </p>
                    </Row>
                    <Row>
                      <Col>
                        <Button
                          onClick={() => {
                            setEditAddressId(thisAddress._id);
                            setShowAddressModal(true);
                          }}
                        >
                          <i className="bi bi-pencil" /> Edit
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          onClick={() => {
                            setDeleteAddressId(thisAddress._id);
                            setShowConfirmDeleteAddressModal(true);
                          }}
                        >
                          <i className="bi bi-trash3" /> Delete
                        </Button>
                      </Col>
                      <Col>
                        <Form.Check
                          type="radio"
                          name="default-address"
                          value={thisAddress._id}
                          checked={thisAddress._id === userProfile.data?.defaultAddress}
                          id={`default-address-radio-${thisAddress._id}`}
                          label="Default Address"
                          onChange={handleChangeDefaultAddress}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}

            <ManageAddressModal 
              editAddressId={editAddressId}
              showAddressModal={showAddressModal}
              handleModalClose={handleModalClose} 
            />

            <Modal
              show={showConfirmDeleteAddressModal}
              onHide={() => {
                if (!isDeleting) {
                  setShowConfirmDeleteAddressModal(false);
                  setDeleteAddressId(null);
                }
              }}
            >
              <Modal.Header>
                <Modal.Title>Delete Address</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this address?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  type="reset"
                  onClick={() => {
                    setShowConfirmDeleteAddressModal(false);
                    setDeleteAddressId(null);
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isDeleting}
                  onClick={() => {handleDeleteAddress()}}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </Row>
    </div>
  );
}
