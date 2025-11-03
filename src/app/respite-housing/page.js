'use client';

import { Container, Row, Col, Card , Button } from 'react-bootstrap';
import Link from 'next/link';

function RespiteHousing() {
  return (
    <Container className="py-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <h1 className="text-center mb-5">Respite Housing</h1>
          <h2 className="h4 mb-4 text-center">Immediate Support for Individuals Seeking Treatment</h2>

          <Card className="mb-5 shadow-sm">
            <Card.Body>
              <p className="lead">At 2nd Chance Recovery, we understand that when someone asks for help with substance use, time is critical. The decision to seek treatment is often fragile, and delays can increase the risk of overdose or a return to use. Our Respite Housing program provides immediate, low-barrier shelter for individuals struggling with substance use disorder who are seeking treatment but cannot gain same-day admission.</p>
              <p>We prioritize an immediate response, offering a safe, supportive space within hours of someone reaching out for help. Research and experience have shown that there is typically a 4-6 hour window to intervene once someone makes the courageous decision to seek recovery. Through Respite Housing, we fill this gap, ensuring no one has to face the dangerous waiting period alone.</p>
            </Card.Body>
          </Card>

          <h2 className="h3 mb-4 text-center">How Respite Housing Works</h2>
          <p className="text-center lead mb-5">We believe that asking for help is an opportunity that cannot be missed. With Respite Housing, we ensure that when individuals take that step, 2nd Chance Recovery is there to catch them. Together, we bridge the gap between decision and treatment, providing hope, safety, and a chance for lasting change.</p>

          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Low Barrier Access</Card.Title>
                  <Card.Text>There are minimal requirements to enter Respite Housing. Our goal is to remove obstacles, not create more.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Immediate Placement</Card.Title>
                  <Card.Text>As soon as someone reaches out, we respond to get them to safety within hours.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Client Care Coordination</Card.Title>
                  <Card.Text>While in Respite Housing, our team works directly with individuals to coordinate their care, secure a treatment placement, and connect them with vital recovery resources such as transportation and MAT.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Safe Environment</Card.Title>
                  <Card.Text>Our housing provides stability and respite, reducing risks such as overdose and empowering individuals to move forward with their recovery journey.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="text-center mt-5">
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Get Started Today
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default RespiteHousing;
