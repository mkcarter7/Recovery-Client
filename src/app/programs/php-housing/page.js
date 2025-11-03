'use client';

import { Container, Row, Col, Card , Button } from 'react-bootstrap';
import Link from 'next/link';

function PHPHousing() {
  return (
    <Container className="py-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <h1 className="text-center mb-5">Partial Hospitalization Program (PHP) with Housing</h1>

          <Card className="mb-5 shadow-sm">
            <Card.Body>
              <p className="lead">Imagine a place where you can focus entirely on your recovery without the distractions of daily life. Our PHP with housing combines the highest level of outpatient care with safe, comfortable accommodations.</p>
              <p>You&apos;ll spend your days participating in evidence-based therapies and holistic activities designed to address every aspect of your well-being. Evenings offer time to relax, connect with others in recovery, and reflect on the progress you&apos;ve made in a serene, supportive environment.</p>
            </Card.Body>
          </Card>

          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">What&apos;s Included</Card.Title>
                  <ul>
                    <li>Highest level of outpatient care</li>
                    <li>Safe, comfortable housing accommodations</li>
                    <li>Evidence-based therapies</li>
                    <li>Holistic activities and wellness programs</li>
                    <li>Supportive community environment</li>
                    <li>Structured daily schedule</li>
                    <li>Evening relaxation and reflection time</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Program Benefits</Card.Title>
                  <ul>
                    <li>Focus entirely on recovery without daily distractions</li>
                    <li>Comprehensive treatment addressing all aspects of well-being</li>
                    <li>Connection with others on the same journey</li>
                    <li>Serene, supportive environment</li>
                    <li>Structured approach to recovery</li>
                    <li>Professional clinical support</li>
                    <li>Safe, comfortable living space</li>
                  </ul>
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

export default PHPHousing;
