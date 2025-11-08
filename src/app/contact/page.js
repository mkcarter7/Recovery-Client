'use client';

import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { apiClient } from '@/api/client';

const CONTACT_DEFAULTS = {
  phone: '+1 (833) HUSTLE 5',
  email: 'info@recoverycenter.org',
  address: 'Cheatham County, Tennessee',
  blurb: "We believe that everyone deserves access to quality recovery and treatment services, regardless of their financial situation. That's why we offer a wide range of payment options to make care accessible to all.",
};

const getContentValue = (content, key, fallback) => {
  if (!content || typeof content !== 'object') {
    return fallback;
  }
  const value = content[key];
  return value === undefined || value === null || value === '' ? fallback : value;
};

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState(CONTACT_DEFAULTS);

  useEffect(() => {
    let isMounted = true;

    const loadContactContent = async () => {
      try {
        const siteContent = await apiClient.getSiteContent().catch(() => ({}));
        if (!isMounted) return;

        setContactInfo({
          phone: getContentValue(siteContent, 'contact_phone', CONTACT_DEFAULTS.phone),
          email: getContentValue(siteContent, 'contact_email', CONTACT_DEFAULTS.email),
          address: getContentValue(siteContent, 'contact_address', CONTACT_DEFAULTS.address),
          blurb: getContentValue(siteContent, 'contact_blurb', CONTACT_DEFAULTS.blurb),
        });
      } catch (err) {
        console.error('Failed to load contact site content:', err);
        if (isMounted) {
          setContactInfo(CONTACT_DEFAULTS);
        }
      }
    };

    loadContactContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const phoneHref = useMemo(() => {
    if (!contactInfo.phone) {
      return undefined;
    }
    const numeric = contactInfo.phone.replace(/[^\d+]/g, '');
    return `tel:${numeric}`;
  }, [contactInfo.phone]);

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
      await apiClient.submitContact(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again or call us directly.');
      console.error('Contact form error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <h1 className="text-center mb-5">Contact Us</h1>

          {submitted && (
            <Alert variant="success" className="mb-4">
              Thank you for contacting us! We&apos;ll get back to you as soon as possible.
            </Alert>
          )}

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h4 mb-3">Get in Touch</Card.Title>
                  <Card.Text>
                    <strong>Phone:</strong>
                    <br />
                    {contactInfo.phone ? (
                      <a href={phoneHref} className="text-decoration-none">
                        {contactInfo.phone}
                      </a>
                    ) : (
                      'Coming soon'
                    )}
                  </Card.Text>
                  <Card.Text>
                    <strong>Email:</strong>
                    <br />
                    {contactInfo.email ? (
                      <a href={`mailto:${contactInfo.email}`} className="text-decoration-none">
                        {contactInfo.email}
                      </a>
                    ) : (
                      'Coming soon'
                    )}
                  </Card.Text>
                  <Card.Text>
                    <strong>Address:</strong>
                    <br />
                    {contactInfo.address || 'Coming soon'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="h4 mb-3">Send Us a Message</Card.Title>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name *</Form.Label>
                      <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Message *</Form.Label>
                      <Form.Control as="textarea" rows={5} name="message" value={formData.message} onChange={handleChange} required />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading} className="w-100">
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col>
              <Card className="bg-light">
                <Card.Body>
                  <h3 className="mb-3">Payment &amp; Insurance Information</h3>
                  <p>{contactInfo.blurb}</p>
                  <p className="mb-0">We are in-network with TNCARE, BlueCare, United Healthcare, WellPoint, and Blue Cross Blue Shield, and we also accept many out-of-network policies. In addition, we provide grant and scholarship opportunities to help ease the financial burden and offer flexible sliding-scale payment plans tailored to your needs.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Contact;
