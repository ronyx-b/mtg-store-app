import useUserProfile from "@/services/cache/useUserProfile";
import { selectToken } from "@/services/store/tokenSlice";
import { Button, Card, Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";

/**
 * @callback SetAddressId
 * @param {string} id
 * @returns {void}
 */
/**
 * Shows a modal for choosing an address
 * @param {Object} props
 * @param {SetAddressId} props.setAddressId 
 * @param {boolean} props.showAddressModal
 * @param {Function} props.handleModalClose
 * @returns {JSX.Element}
 */
export default function ChooseAddressModal({ setAddressId, showAddressModal = false, handleModalClose, ...props }) {
  const token = useSelector(selectToken);
  const userProfile = useUserProfile(token);

  return (
    <Modal
      size="lg"
      show={showAddressModal}
      onHide={handleModalClose}
    >
      <Container style={{ padding: "1rem" }}>
        <Row lg={3} md={2} sm={1} xs={1}>
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
              {userProfile.data?.address.map((thisAddress, i) => (
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
                              setAddressId(thisAddress._id);
                            }}
                          >
                            Use this Address
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </>
          )}
        </Row>
      </Container>
    </Modal>
  );
}