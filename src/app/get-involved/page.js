'use client';

import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { apiClient } from '@/api/client';

function GetInvolved() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiClient.subscribeNewsletter(formData);
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '' });
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
      console.error('Newsletter subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <h1 className="text-center mb-5">Get Involved</h1>

          <Card className="mb-5 shadow-sm">
            <Card.Body>
              <p className="lead text-center">There are many ways to support our mission and help individuals on their recovery journey. Whether you&apos;re interested in volunteering, donating, or staying connected, we welcome your involvement.</p>
            </Card.Body>
          </Card>

          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Volunteer Opportunities</Card.Title>
                  <Card.Text>Join our team of dedicated volunteers who make a difference in the lives of those in recovery. Volunteer opportunities include:</Card.Text>
                  <ul>
                    <li>Peer support and mentorship</li>
                    <li>Activity coordination (gardening, hiking, etc.)</li>
                    <li>Administrative support</li>
                    <li>Event planning and coordination</li>
                    <li>Community outreach</li>
                  </ul>
                  <Card.Text className="mt-3">Contact us to learn more about volunteer opportunities and how you can contribute.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h5">Donations & Support</Card.Title>
                  <Card.Text>Your support helps us provide accessible treatment and support services. We accept:</Card.Text>
                  <ul>
                    <li>Financial donations</li>
                    <li>In-kind donations</li>
                    <li>Scholarship fund contributions</li>
                    <li>Program sponsorships</li>
                    <li>Equipment and supplies</li>
                  </ul>
                  <Card.Text className="mt-3">All donations directly support our mission of providing accessible recovery services.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="mt-4 shadow-sm">
            <Card.Body>
              <h2 className="h4 mb-4 text-center">Stay in the Loop</h2>
              <p className="text-center mb-4">Sign up for our newsletter and keep up to date with 2nd Chance Recovery news, events, and updates.</p>

              {submitted && (
                <Alert variant="success" className="mb-4">
                  Thank you for subscribing! You&apos;ll receive our newsletter updates.
                </Alert>
              )}

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Control type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Control type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Control type="email" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} required />
                  </Col>
                </Row>
                <div className="text-center">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Subscribing...' : 'Sign Up'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <div className="text-center mt-5">
            <Card className="bg-light">
              <Card.Body>
                <h3 className="h5 mb-3">Contact Us to Get Involved</h3>
                <p className="mb-2">
                  <strong>Phone:</strong> <a href="tel:+18334878535">+1 (833) HUSTLE 5</a>
                </p>
                <p className="mb-0">
                  <strong>Email:</strong> <a href="mailto:info@recoverycenter.org">info@recoverycenter.org</a>
                </p>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default GetInvolved;
