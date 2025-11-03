'use client';

import { Container, Row, Col, Card , Button } from 'react-bootstrap';
import Link from 'next/link';

function VocationalRehab() {
  return (
    <Container className="py-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <h1 className="text-center mb-5">6-Month Vocational Rehabilitation Program</h1>

          <Card className="mb-5 shadow-sm">
            <Card.Body>
              <p className="lead">Recovery isn&apos;t just about today – it&apos;s about building a future you&apos;re excited to wake up to. Our vocational rehabilitation program is designed to help you do just that.</p>
              <p>Over six months, you&apos;ll receive job readiness training, resume building, interview coaching, and job placement support. This program ensures that when you&apos;re ready to re-enter the workforce, you&apos;ll do so with confidence, skills, and purpose.</p>
            </Card.Body>
          </Card>

          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Job Readiness Training</Card.Title>
                  <ul>
                    <li>Professional skills development</li>
                    <li>Workplace communication</li>
                    <li>Time management</li>
                    <li>Professional etiquette</li>
                    <li>Conflict resolution</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Career Development</Card.Title>
                  <ul>
                    <li>Resume building and optimization</li>
                    <li>Cover letter writing</li>
                    <li>Interview preparation and coaching</li>
                    <li>Job search strategies</li>
                    <li>Career goal setting</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Job Placement Support</Card.Title>
                  <ul>
                    <li>Job placement assistance</li>
                    <li>Employer connections</li>
                    <li>Follow-up support</li>
                    <li>Workplace integration guidance</li>
                    <li>Ongoing career mentorship</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="mt-4 bg-light">
            <Card.Body>
              <h3 className="h5 mb-3">Program Timeline</h3>
              <p>This comprehensive 6-month program is structured to support your recovery journey while building the professional skills and confidence needed for long-term success. Throughout the program, you&apos;ll receive ongoing support from our vocational rehabilitation team.</p>
            </Card.Body>
          </Card>

          <div className="text-center mt-5">
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Start Your Career Journey
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default VocationalRehab;
