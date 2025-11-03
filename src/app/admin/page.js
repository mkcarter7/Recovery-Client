'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Alert, Table, Badge, Modal } from 'react-bootstrap';
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
  const [deleteModal, setDeleteModal] = useState({ show: false, type: null, id: null, name: null });
  const [deleting, setDeleting] = useState(false);

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

      // Mock data for development (remove when backend is ready)
      const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

      try {
        const [contactResult, newsletterResult] = await Promise.allSettled([apiClient.getContactSubmissions(), apiClient.getNewsletterSubscriptions()]);

        // Handle contact submissions
        if (contactResult.status === 'fulfilled') {
          const contactData = contactResult.value;
          console.log('Contact submissions:', contactData);
          // Handle paginated response (Django REST framework format)
          const submissions = Array.isArray(contactData) ? contactData : contactData?.results || [];
          setContactSubmissions(submissions);
        } else {
          console.error('Error fetching contact submissions:', contactResult.reason);
          if (USE_MOCK_DATA) {
            // Use mock data for development
            setContactSubmissions([
              {
                id: 1,
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '(555) 123-4567',
                message: 'I am interested in learning more about your PHP housing program.',
                created_at: new Date().toISOString(),
              },
              {
                id: 2,
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                phone: '(555) 987-6543',
                message: 'Could you provide more information about your IOP program?',
                created_at: new Date(Date.now() - 86400000).toISOString(),
              },
            ]);
            console.log('Using mock contact submissions data');
          } else {
            setError(`Failed to load contact submissions: ${contactResult.reason?.message || 'Unknown error'}. The API endpoint may not be implemented yet.`);
            setContactSubmissions([]);
          }
        }

        // Handle newsletter subscriptions
        if (newsletterResult.status === 'fulfilled') {
          const newsletterData = newsletterResult.value;
          console.log('Newsletter subscriptions:', newsletterData);
          // Handle paginated response (Django REST framework format)
          const subscriptions = Array.isArray(newsletterData) ? newsletterData : newsletterData?.results || [];
          setNewsletterSubscriptions(subscriptions);
        } else {
          console.error('Error fetching newsletter subscriptions:', newsletterResult.reason);
          if (USE_MOCK_DATA) {
            // Use mock data for development
            setNewsletterSubscriptions([
              {
                id: 1,
                firstName: 'Alice',
                lastName: 'Johnson',
                email: 'alice.johnson@example.com',
                created_at: new Date().toISOString(),
              },
              {
                id: 2,
                firstName: 'Bob',
                lastName: 'Williams',
                email: 'bob.williams@example.com',
                created_at: new Date(Date.now() - 172800000).toISOString(),
              },
            ]);
            console.log('Using mock newsletter subscriptions data');
          } else {
            const errorMsg = `Failed to load newsletter subscriptions: ${newsletterResult.reason?.message || 'Unknown error'}. The API endpoint may not be implemented yet.`;
            setError((prevError) => (prevError ? `${prevError}\n${errorMsg}` : errorMsg));
            setNewsletterSubscriptions([]);
          }
        }
      } catch (err) {
        console.error('Unexpected error fetching submissions:', err);
        setError(`Failed to load form submissions: ${err.message || 'Unknown error'}`);
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

  const handleDeleteClick = (type, id, name) => {
    setDeleteModal({ show: true, type, id, name });
  };

  const handleDeleteConfirm = async () => {
    const { type, id } = deleteModal;
    setDeleting(true);
    setError('');

    try {
      if (type === 'contact') {
        await apiClient.deleteContactSubmission(id);
        setContactSubmissions(contactSubmissions.filter((item) => item.id !== id));
      } else if (type === 'newsletter') {
        await apiClient.deleteNewsletterSubscription(id);
        setNewsletterSubscriptions(newsletterSubscriptions.filter((item) => item.id !== id));
      }
      setDeleteModal({ show: false, type: null, id: null, name: null });
    } catch (err) {
      console.error('Error deleting submission:', err);
      setError(`Failed to delete ${type === 'contact' ? 'contact submission' : 'newsletter subscription'}. Please try again.`);
      setDeleteModal({ show: false, type: null, id: null, name: null });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, type: null, id: null, name: null });
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
          <Alert.Heading>Error Loading Submissions</Alert.Heading>
          <div style={{ whiteSpace: 'pre-line' }}>{error}</div>
          <hr />
          <p className="mb-0 small">
            <strong>Note:</strong> Make sure your Django backend has these endpoints implemented:
            <br />• <code>GET /api/admin/contact-submissions/</code>
            <br />• <code>GET /api/admin/newsletter-subscriptions/</code>
            <br />
            Check the browser console for more details.
          </p>
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
                        <th>Actions</th>
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
                          <td>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick('contact', submission.id, submission.name || submission.email)}>
                              Delete
                            </Button>
                          </td>
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
                        <th>Actions</th>
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
                          <td>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick('newsletter', subscription.id, subscription.email || `${subscription.firstName || subscription.first_name || ''} ${subscription.lastName || subscription.last_name || ''}`.trim())}>
                              Delete
                            </Button>
                          </td>
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

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModal.show} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this {deleteModal.type === 'contact' ? 'contact submission' : 'newsletter subscription'}?
          {deleteModal.name && (
            <p className="mt-2 mb-0">
              <strong>{deleteModal.name}</strong>
            </p>
          )}
          <p className="text-danger mt-2 mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminPage;
