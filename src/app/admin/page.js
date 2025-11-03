'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Alert, Table, Badge } from 'react-bootstrap';
import { useAuth } from '@/utils/context/authContext';
import { signOut } from '@/utils/auth';
import { apiClient } from '@/api/client';
import Loading from '@/components/Loading';

function AdminPage() {
  const { user, userLoading } = useAuth();
  const router = useRouter();
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect to home if user is not authenticated
    if (!userLoading && !user) {
      router.push('/');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) return;

      setLoading(true);
      setError('');

      try {
        const [contactData, newsletterData] = await Promise.all([apiClient.getContactSubmissions().catch(() => []), apiClient.getNewsletterSubscriptions().catch(() => [])]);
        setContactSubmissions(Array.isArray(contactData) ? contactData : []);
        setNewsletterSubscriptions(Array.isArray(newsletterData) ? newsletterData : []);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load form submissions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  // Show loading while checking auth status
  if (userLoading || loading) {
    return <Loading />;
  }

  // Show message if not authenticated (will redirect)
  if (!user) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Please sign in to access the admin panel.</Alert>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-5 fw-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted">Welcome, {user.displayName || user.email}</p>
            </div>
            <Button variant="outline-danger" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Contact Form Submissions */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title className="h5 mb-0">Contact Form Submissions</Card.Title>
              <Badge bg="primary">{contactSubmissions.length}</Badge>
            </Card.Header>
            <Card.Body>
              {contactSubmissions.length === 0 ? (
                <p className="text-muted text-center py-4">No contact form submissions yet.</p>
              ) : (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Message</th>
                        <th>Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactSubmissions.map((submission) => (
                        <tr key={submission.id || submission.email}>
                          <td>{submission.name || 'N/A'}</td>
                          <td>
                            <a href={`mailto:${submission.email}`}>{submission.email || 'N/A'}</a>
                          </td>
                          <td>{submission.phone ? <a href={`tel:${submission.phone}`}>{submission.phone}</a> : 'N/A'}</td>
                          <td>
                            <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{submission.message || 'N/A'}</div>
                          </td>
                          <td>{formatDate(submission.created_at || submission.submitted_at || submission.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Newsletter Subscriptions */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title className="h5 mb-0">Newsletter Subscriptions</Card.Title>
              <Badge bg="success">{newsletterSubscriptions.length}</Badge>
            </Card.Header>
            <Card.Body>
              {newsletterSubscriptions.length === 0 ? (
                <p className="text-muted text-center py-4">No newsletter subscriptions yet.</p>
              ) : (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Subscribed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsletterSubscriptions.map((subscription) => (
                        <tr key={subscription.id || subscription.email}>
                          <td>{subscription.firstName || subscription.first_name || 'N/A'}</td>
                          <td>{subscription.lastName || subscription.last_name || 'N/A'}</td>
                          <td>
                            <a href={`mailto:${subscription.email}`}>{subscription.email || 'N/A'}</a>
                          </td>
                          <td>{formatDate(subscription.created_at || subscription.subscribed_at || subscription.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPage;
