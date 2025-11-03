'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';

function OurStory() {
  return (
    <Container className="py-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <h1 className="text-center mb-5">Our Story</h1>

          <Card className="mb-5 shadow-sm">
            <Card.Body>
              <p className="lead">2nd Chance Recovery was founded on the belief that everyone deserves access to quality recovery and treatment services, regardless of their circumstances. We understand that the journey to recovery is deeply personal and unique to each individual.</p>
              <p>Nestled in the rolling hills of beautiful Cheatham County, Tennessee, we&apos;ve created a sanctuary where clinical expertise meets nature&apos;s restorative power. Our approach goes far beyond traditional treatment, offering a healing environment that addresses the mind, body, and spirit.</p>
              <p>We believe recovery is about more than sobriety – it&apos;s about living a life you&apos;re proud of. That&apos;s why our programs are tailored to meet unique needs, offering structure, support, and connection every step of the way.</p>
              <p>Our mission is to provide immediate, accessible, and effective treatment for individuals struggling with substance use disorder, while also building a supportive community that extends far beyond the treatment period.</p>
            </Card.Body>
          </Card>

          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Our Values</Card.Title>
                  <ul>
                    <li>Compassion and understanding</li>
                    <li>Accessibility for all</li>
                    <li>Evidence-based treatment</li>
                    <li>Holistic wellness approach</li>
                    <li>Community support</li>
                    <li>Long-term recovery focus</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Our Approach</Card.Title>
                  <ul>
                    <li>Individualized treatment plans</li>
                    <li>Nature-based therapeutic activities</li>
                    <li>Clinical excellence</li>
                    <li>Immediate response to crisis</li>
                    <li>Supportive housing options</li>
                    <li>Vocational rehabilitation</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default OurStory;
