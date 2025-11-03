'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';

function Partners() {
  return (
    <Container className="py-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <h1 className="text-center mb-5">Our Partners</h1>

          <Card className="mb-5 shadow-sm">
            <Card.Body>
              <p className="lead">We work closely with a network of partners to ensure comprehensive care and support for our clients. These partnerships enable us to provide a wide range of services and resources.</p>
            </Card.Body>
          </Card>

          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Insurance Partners</Card.Title>
                  <ul>
                    <li>TNCARE</li>
                    <li>BlueCare</li>
                    <li>United Healthcare</li>
                    <li>WellPoint</li>
                    <li>Blue Cross Blue Shield</li>
                  </ul>
                  <Card.Text className="mt-3">We accept many out-of-network policies and work with insurance providers to make treatment accessible.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Community Partners</Card.Title>
                  <ul>
                    <li>Local healthcare providers</li>
                    <li>Employment services</li>
                    <li>Housing organizations</li>
                    <li>Transportation services</li>
                    <li>Community support groups</li>
                  </ul>
                  <Card.Text className="mt-3">Our community partnerships ensure that clients have access to comprehensive support services throughout their recovery journey.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Partners;
