'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';

function MissionHousing() {
  return (
    <Container className="py-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <h1 className="text-center mb-5">Mission & Housing</h1>

          <Card className="mb-5 shadow-sm">
            <Card.Body>
              <h2 className="h4 mb-4">Our Mission</h2>
              <p className="lead">To provide immediate, accessible, and effective treatment for individuals struggling with substance use disorder, while building a supportive community that extends far beyond the treatment period.</p>
              <p>We believe that everyone deserves access to quality recovery and treatment services, regardless of their financial situation. Our mission drives us to offer flexible payment options, grants, scholarships, and sliding-scale plans to ensure that financial barriers never stand in the way of recovery.</p>
            </Card.Body>
          </Card>

          <Card className="mb-5 shadow-sm">
            <Card.Body>
              <h2 className="h4 mb-4">Housing Services</h2>
              <p>Safe, comfortable housing is an essential component of recovery. We provide various housing options to support individuals at different stages of their recovery journey:</p>
              <Row>
                <Col md={6} className="mb-3">
                  <h5>PHP with Housing</h5>
                  <p>Comfortable accommodations for individuals in our Partial Hospitalization Program, providing a stable environment focused entirely on recovery.</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h5>Respite Housing</h5>
                  <p>Immediate, low-barrier shelter for individuals seeking treatment but cannot gain same-day admission. Available within hours of reaching out for help.</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h5>Transitional Housing</h5>
                  <p>Supportive housing for individuals transitioning from intensive treatment to independent living, with ongoing support and structure.</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h5>Safe Environment</h5>
                  <p>All our housing facilities prioritize safety, stability, and a supportive community environment that empowers individuals in their recovery journey.</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default MissionHousing;
