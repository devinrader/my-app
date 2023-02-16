import { Component } from 'solid-js';
import { Container, Row, Col } from "solid-bootstrap";
import { useParams, Outlet } from "@solidjs/router"

export const CampaignsLayout: Component = () => {

  const params = useParams();
  console.log(params.company);

  return (
    <Container style={`margin-top: 15px;`}>
      <Row>
        <Col xs={12}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default CampaignsLayout;