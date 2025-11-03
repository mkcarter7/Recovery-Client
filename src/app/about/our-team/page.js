'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';

function OurTeam() {
  return (
    <Container className="py-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <h1 className="text-center mb-5">Our Team</h1>

          <Card className="mb-5 shadow-sm">
            <Card.Body>
              <p className="lead text-center">Our dedicated team of professionals is committed to supporting your recovery journey. We bring together clinical expertise, compassion, and a deep understanding of the recovery process.</p>
            </Card.Body>
          </Card>

          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Clinical Team</Card.Title>
                  <Card.Text>Our clinical team includes licensed therapists, counselors, and medical professionals who specialize in substance use disorder treatment. They bring years of experience and a commitment to evidence-based practices.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Support Staff</Card.Title>
                  <Card.Text>Our support staff ensures that every aspect of your stay is comfortable and supportive. From housing coordination to activity planning, they&apos;re here to help you focus on your recovery.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Vocational Specialists</Card.Title>
                  <Card.Text>Our vocational rehabilitation specialists work with you to build career skills, prepare for job interviews, and connect with employment opportunities that align with your recovery goals.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Peer Support</Card.Title>
                  <Card.Text>Peer support specialists who have walked the path of recovery themselves provide invaluable guidance, understanding, and encouragement throughout your journey.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default OurTeam;
