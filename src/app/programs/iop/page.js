'use client';

import { Container, Row, Col, Card , Button } from 'react-bootstrap';
import Link from 'next/link';

function IOP() {
  return (
    <Container className="py-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <h1 className="text-center mb-5">Intensive Outpatient Program (IOP)</h1>

          <Card className="mb-5 shadow-sm">
            <Card.Body>
              <p className="lead">Life doesn&apos;t stop, and neither should your recovery. Our IOP is designed for individuals who need flexible, effective treatment that fits into their busy lives.</p>
              <p>Through group and individual therapy, you&apos;ll work on building the tools you need to navigate challenges, strengthen relationships, and stay committed to your goals. This program empowers you to continue working, studying, or caring for your family while staying focused on your journey to lasting wellness.</p>
            </Card.Body>
          </Card>

          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Program Features</Card.Title>
                  <ul>
                    <li>Flexible scheduling to fit your life</li>
                    <li>Group therapy sessions</li>
                    <li>Individual therapy sessions</li>
                    <li>Skill-building workshops</li>
                    <li>Relapse prevention strategies</li>
                    <li>Family involvement opportunities</li>
                    <li>Peer support groups</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Who Benefits</Card.Title>
                  <ul>
                    <li>Individuals transitioning from higher levels of care</li>
                    <li>Those who need structured support while maintaining daily responsibilities</li>
                    <li>Working professionals seeking recovery support</li>
                    <li>Students balancing recovery and education</li>
                    <li>Parents who need to maintain family responsibilities</li>
                    <li>Anyone committed to building lasting recovery skills</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="text-center mt-5">
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default IOP;
