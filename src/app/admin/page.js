'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Alert, Table, Badge, Modal, Form } from 'react-bootstrap';
import { useAuth } from '@/utils/context/authContext';
import { signOut } from '@/utils/auth';
import { apiClient } from '@/api/client';
import Loading from '@/components/Loading';

const HERO_FIELD_MAP = {
  headline: 'hero_headline',
  subheadline: 'hero_subheadline',
  description: 'hero_description',
  primaryCtaText: 'hero_primary_cta_text',
  primaryCtaHref: 'hero_primary_cta_href',
  secondaryCtaText: 'hero_secondary_cta_text',
  secondaryCtaHref: 'hero_secondary_cta_href',
  backgroundGradient: 'hero_background_gradient',
};

const STORY_FIELD_MAP = {
  heading: 'story_heading',
  body: 'story_body',
};

const CONTACT_FIELD_MAP = {
  phone: 'contact_phone',
  email: 'contact_email',
  address: 'contact_address',
  blurb: 'contact_blurb',
};

const HERO_DEFAULTS = {
  headline: 'Find Your Path to Recovery',
  subheadline: 'WHO WE ARE ARE WHERE WE ARE LOCATED',
  description: 'At 2nd Chance Recovery, WHAT WE BELIEVE',
  primaryCtaText: 'Get Started',
  primaryCtaHref: '/contact',
  secondaryCtaText: 'Learn More',
  secondaryCtaHref: '/programs/php-housing',
  backgroundGradient: 'linear-gradient(135deg, #000000 0%, #8b0000 50%, #dc3545 100%)',
};

const STORY_DEFAULTS = {
  heading: 'Our Story',
  body: '',
};

const CONTACT_DEFAULTS = {
  phone: '+1 (833) HUSTLE 5',
  email: 'info@recoverycenter.org',
  address: 'Cheatham County, Tennessee',
  blurb: "We believe that everyone deserves access to quality recovery and treatment services, regardless of their financial situation. That's why we offer a wide range of payment options to make care accessible to all.",
};

const PROGRAM_TYPE_OPTIONS = [
  { value: 'PHP', label: 'Partial Hospitalization Program (PHP)' },
  { value: 'IOP', label: 'Intensive Outpatient Program (IOP)' },
  { value: 'VOC', label: 'Vocational Rehabilitation (VOC)' },
  { value: 'RES', label: 'Respite Housing (RES)' },
];

const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const getContentValue = (map, key, fallback) => {
  if (!map || typeof map !== 'object') return fallback;
  const value = map[key];
  return value === undefined || value === null ? fallback : value;
};

const buildHeroForm = (content = {}) => ({
  headline: getContentValue(content, HERO_FIELD_MAP.headline, HERO_DEFAULTS.headline),
  subheadline: getContentValue(content, HERO_FIELD_MAP.subheadline, HERO_DEFAULTS.subheadline),
  description: getContentValue(content, HERO_FIELD_MAP.description, HERO_DEFAULTS.description),
  primaryCtaText: getContentValue(content, HERO_FIELD_MAP.primaryCtaText, HERO_DEFAULTS.primaryCtaText),
  primaryCtaHref: getContentValue(content, HERO_FIELD_MAP.primaryCtaHref, HERO_DEFAULTS.primaryCtaHref),
  secondaryCtaText: getContentValue(content, HERO_FIELD_MAP.secondaryCtaText, HERO_DEFAULTS.secondaryCtaText),
  secondaryCtaHref: getContentValue(content, HERO_FIELD_MAP.secondaryCtaHref, HERO_DEFAULTS.secondaryCtaHref),
  backgroundGradient: getContentValue(content, HERO_FIELD_MAP.backgroundGradient, HERO_DEFAULTS.backgroundGradient),
});

const buildStoryForm = (content = {}) => ({
  heading: getContentValue(content, STORY_FIELD_MAP.heading, STORY_DEFAULTS.heading),
  body: getContentValue(content, STORY_FIELD_MAP.body, STORY_DEFAULTS.body),
});

const buildContactForm = (content = {}) => ({
  phone: getContentValue(content, CONTACT_FIELD_MAP.phone, CONTACT_DEFAULTS.phone),
  email: getContentValue(content, CONTACT_FIELD_MAP.email, CONTACT_DEFAULTS.email),
  address: getContentValue(content, CONTACT_FIELD_MAP.address, CONTACT_DEFAULTS.address),
  blurb: getContentValue(content, CONTACT_FIELD_MAP.blurb, CONTACT_DEFAULTS.blurb),
});

const normalizeProgram = (program) => ({
  id: program.id,
  name: program.name || '',
  slug: program.slug || '',
  programType: program.program_type || 'PHP',
  shortDescription: program.short_description || '',
  description: program.description || '',
  featuresText: Array.isArray(program.features) ? program.features.join('\n') : '',
  order: program.order ?? 0,
  isActive: program.is_active ?? true,
  isNew: false,
});

function AdminPage() {
  const { user, userLoading } = useAuth();
  const router = useRouter();

  const [heroForm, setHeroForm] = useState(HERO_DEFAULTS);
  const [storyForm, setStoryForm] = useState(STORY_DEFAULTS);
  const [contactForm, setContactForm] = useState(CONTACT_DEFAULTS);
  const [programsList, setProgramsList] = useState([]);
  const [programSavingId, setProgramSavingId] = useState(null);

  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState([]);

  const [contentLoading, setContentLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);

  const [contentError, setContentError] = useState('');
  const [contentSuccess, setContentSuccess] = useState('');
  const [submissionsError, setSubmissionsError] = useState('');

  const [deleteModal, setDeleteModal] = useState({ show: false, type: null, id: null, name: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (!user) return;

    const loadContent = async () => {
      setContentLoading(true);
      setContentError('');
      try {
        const [siteContent, adminPrograms] = await Promise.all([apiClient.getSiteContent().catch(() => ({})), apiClient.getAdminPrograms().catch(() => [])]);

        setHeroForm(buildHeroForm(siteContent));
        setStoryForm(buildStoryForm(siteContent));
        setContactForm(buildContactForm(siteContent));
        setProgramsList(Array.isArray(adminPrograms) ? adminPrograms.map(normalizeProgram) : []);
      } catch (error) {
        console.error('Failed to load site content:', error);
        setContentError('Failed to load site content. Please try again.');
      } finally {
        setContentLoading(false);
      }
    };

    loadContent();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const loadSubmissions = async () => {
      setSubmissionsLoading(true);
      setSubmissionsError('');
      const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

      try {
        const [contactResult, newsletterResult] = await Promise.allSettled([apiClient.getContactSubmissions(), apiClient.getNewsletterSubscriptions()]);

        if (contactResult.status === 'fulfilled') {
          const submissions = Array.isArray(contactResult.value) ? contactResult.value : contactResult.value?.results || [];
          setContactSubmissions(submissions);
        } else if (USE_MOCK_DATA) {
          setContactSubmissions([
            {
              id: 1,
              name: 'John Doe',
              email: 'john.doe@example.com',
              phone: '(555) 123-4567',
              message: 'I am interested in learning more about your PHP housing program.',
              created_at: new Date().toISOString(),
            },
          ]);
        } else {
          setSubmissionsError(`Failed to load contact submissions: ${contactResult.reason?.message || 'Unknown error'}.`);
        }

        if (newsletterResult.status === 'fulfilled') {
          const subs = Array.isArray(newsletterResult.value) ? newsletterResult.value : newsletterResult.value?.results || [];
          setNewsletterSubscriptions(subs);
        } else if (USE_MOCK_DATA) {
          setNewsletterSubscriptions([
            {
              id: 1,
              firstName: 'Sample',
              lastName: 'Subscriber',
              email: 'sample@example.com',
              created_at: new Date().toISOString(),
            },
          ]);
        } else {
          const message = `Failed to load newsletter subscriptions: ${newsletterResult.reason?.message || 'Unknown error'}.`;
          setSubmissionsError((prev) => (prev ? `${prev}\n${message}` : message));
        }
      } catch (error) {
        console.error('Failed to load submissions:', error);
        setSubmissionsError(`Failed to load submissions: ${error.message || 'Unknown error'}.`);
      } finally {
        setSubmissionsLoading(false);
      }
    };

    loadSubmissions();
  }, [user]);

  const handleHeroChange = (field) => (event) => {
    const { value } = event.target;
    setHeroForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStoryChange = (field) => (event) => {
    const { value } = event.target;
    setStoryForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field) => (event) => {
    const { value } = event.target;
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveSiteContentSection = async (fieldMap, values) => {
    await Promise.all(Object.entries(fieldMap).map(([field, key]) => apiClient.updateSiteContent(key, values[field] ?? '')));
  };

  const handleHeroSubmit = async (event) => {
    event.preventDefault();
    setContentError('');
    setContentSuccess('');
    try {
      await saveSiteContentSection(HERO_FIELD_MAP, heroForm);
      setContentSuccess('Hero content updated successfully.');
    } catch (error) {
      console.error('Failed to update hero content:', error);
      setContentError('Failed to update hero content. Please try again.');
    }
  };

  const handleStorySubmit = async (event) => {
    event.preventDefault();
    setContentError('');
    setContentSuccess('');
    try {
      await saveSiteContentSection(STORY_FIELD_MAP, storyForm);
      setContentSuccess('Story content updated successfully.');
    } catch (error) {
      console.error('Failed to update story content:', error);
      setContentError('Failed to update story content. Please try again.');
    }
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setContentError('');
    setContentSuccess('');
    try {
      await saveSiteContentSection(CONTACT_FIELD_MAP, contactForm);
      setContentSuccess('Contact information updated successfully.');
    } catch (error) {
      console.error('Failed to update contact information:', error);
      setContentError('Failed to update contact information. Please try again.');
    }
  };

  const handleAddProgram = () => {
    setProgramsList((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        name: '',
        slug: '',
        programType: 'PHP',
        shortDescription: '',
        description: '',
        featuresText: '',
        order: prev.length,
        isActive: true,
        isNew: true,
      },
    ]);
  };

  const handleProgramFieldChange = (id, field, value) => {
    setProgramsList((prev) =>
      prev.map((program) =>
        program.id === id
          ? {
              ...program,
              [field]: field === 'order' ? Number(value) : value,
            }
          : program,
      ),
    );
  };

  const handleProgramSave = async (program) => {
    setContentError('');
    setContentSuccess('');

    if (!program.name.trim()) {
      setContentError('Program name is required.');
      return;
    }

    setProgramSavingId(program.id);

    const slug = (program.slug || slugify(program.name)).trim();
    if (!slug) {
      setContentError('Program slug is required.');
      setProgramSavingId(null);
      return;
    }

    const features = program.featuresText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const payload = {
      name: program.name.trim(),
      slug,
      program_type: program.programType || 'PHP',
      short_description: program.shortDescription || '',
      description: program.description || '',
      features,
      order: Number.isFinite(program.order) ? program.order : 0,
      is_active: Boolean(program.isActive),
    };

    try {
      let savedProgram;
      if (!program.id || program.id.toString().startsWith('new-') || program.isNew) {
        savedProgram = await apiClient.createProgram(payload);
      } else {
        savedProgram = await apiClient.updateProgram(program.id, payload);
      }

      setProgramsList((prev) => prev.map((item) => (item.id === program.id ? normalizeProgram(savedProgram) : item)));
      setContentSuccess('Program saved successfully.');
    } catch (error) {
      console.error('Failed to save program:', error);
      setContentError('Failed to save program. Please check the fields and try again.');
    } finally {
      setProgramSavingId(null);
    }
  };

  const requestProgramDelete = (program) => {
    setDeleteModal({
      show: true,
      type: 'program',
      id: program.id,
      name: program.name || program.slug || 'Program',
    });
  };

  const handleDeleteConfirm = async () => {
    const { type, id } = deleteModal;
    if (!type) return;

    setDeleting(true);

    try {
      if (type === 'contact') {
        await apiClient.deleteContactSubmission(id);
        setContactSubmissions((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'newsletter') {
        await apiClient.deleteNewsletterSubscription(id);
        setNewsletterSubscriptions((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'program') {
        if (!id || id.toString().startsWith('new-')) {
          setProgramsList((prev) => prev.filter((program) => program.id !== id));
        } else {
          await apiClient.deleteProgram(id);
          setProgramsList((prev) => prev.filter((program) => program.id !== id));
        }
        setContentSuccess('Program deleted successfully.');
      }
    } catch (error) {
      console.error('Deletion failed:', error);
      if (type === 'program') {
        setContentError('Failed to delete program. Please try again.');
      } else {
        setSubmissionsError('Failed to delete item. Please try again.');
      }
    } finally {
      setDeleting(false);
      setDeleteModal({ show: false, type: null, id: null, name: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, type: null, id: null, name: null });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const submissionsNote = useMemo(
    () => (
      <>
        <strong>Note:</strong> Ensure the Django backend exposes:
        <br />• <code>GET /api/admin/contact-submissions/</code>
        <br />• <code>GET /api/admin/newsletter-subscriptions/</code>
      </>
    ),
    [],
  );

  if (userLoading || contentLoading || submissionsLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Please sign in to access the admin panel.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="display-5 fw-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted mb-0">Welcome, {user.displayName || user.email}</p>
            </div>
            <Button variant="outline-danger" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </Col>
      </Row>

      {contentError && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setContentError('')}>
          {contentError}
        </Alert>
      )}

      {contentSuccess && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setContentSuccess('')}>
          {contentSuccess}
        </Alert>
      )}

      {/* Hero Content */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              <Card.Title className="h5 mb-0">Hero Content</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleHeroSubmit}>
                <Row className="gy-3">
                  <Col md={6}>
                    <Form.Group controlId="heroHeadline">
                      <Form.Label>Headline</Form.Label>
                      <Form.Control type="text" value={heroForm.headline} onChange={handleHeroChange('headline')} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="heroSubheadline">
                      <Form.Label>Subheadline</Form.Label>
                      <Form.Control type="text" value={heroForm.subheadline} onChange={handleHeroChange('subheadline')} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="heroDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control as="textarea" rows={3} value={heroForm.description} onChange={handleHeroChange('description')} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="heroPrimaryCtaText">
                      <Form.Label>Primary CTA Text</Form.Label>
                      <Form.Control type="text" value={heroForm.primaryCtaText} onChange={handleHeroChange('primaryCtaText')} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="heroPrimaryCtaHref">
                      <Form.Label>Primary CTA Link</Form.Label>
                      <Form.Control type="text" value={heroForm.primaryCtaHref} onChange={handleHeroChange('primaryCtaHref')} placeholder="/contact" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="heroSecondaryCtaText">
                      <Form.Label>Secondary CTA Text</Form.Label>
                      <Form.Control type="text" value={heroForm.secondaryCtaText} onChange={handleHeroChange('secondaryCtaText')} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="heroSecondaryCtaHref">
                      <Form.Label>Secondary CTA Link</Form.Label>
                      <Form.Control type="text" value={heroForm.secondaryCtaHref} onChange={handleHeroChange('secondaryCtaHref')} placeholder="/programs/php-housing" />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="heroBackgroundGradient">
                      <Form.Label>Background Gradient</Form.Label>
                      <Form.Control type="text" value={heroForm.backgroundGradient} onChange={handleHeroChange('backgroundGradient')} />
                      <Form.Text muted>
                        CSS gradient for hero background. Example: <code>linear-gradient(135deg, #000000 0%, #8b0000 50%, #dc3545 100%)</code>
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end mt-4">
                  <Button type="submit" variant="primary">
                    Save Hero Content
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Story Content */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              <Card.Title className="h5 mb-0">Story Content</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleStorySubmit}>
                <Form.Group controlId="storyHeading" className="mb-3">
                  <Form.Label>Heading</Form.Label>
                  <Form.Control type="text" value={storyForm.heading} onChange={handleStoryChange('heading')} required />
                </Form.Group>
                <Form.Group controlId="storyBody" className="mb-3">
                  <Form.Label>Story Body</Form.Label>
                  <Form.Control as="textarea" rows={8} value={storyForm.body} onChange={handleStoryChange('body')} placeholder="Use blank lines to separate paragraphs." />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button type="submit" variant="primary">
                    Save Story Content
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contact Content */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              <Card.Title className="h5 mb-0">Contact Information</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleContactSubmit}>
                <Row className="gy-3">
                  <Col md={6}>
                    <Form.Group controlId="contactPhone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control type="text" value={contactForm.phone} onChange={handleContactChange('phone')} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="contactEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" value={contactForm.email} onChange={handleContactChange('email')} />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group controlId="contactAddress">
                      <Form.Label>Address</Form.Label>
                      <Form.Control type="text" value={contactForm.address} onChange={handleContactChange('address')} />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group controlId="contactBlurb">
                      <Form.Label>Payment &amp; Insurance Message</Form.Label>
                      <Form.Control as="textarea" rows={4} value={contactForm.blurb} onChange={handleContactChange('blurb')} />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end mt-4">
                  <Button type="submit" variant="primary">
                    Save Contact Information
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Programs */}
      <Row className="mb-5">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title className="h5 mb-0">Programs</Card.Title>
              <Button variant="outline-secondary" size="sm" onClick={handleAddProgram}>
                Add Program
              </Button>
            </Card.Header>
            <Card.Body>
              {programsList.length === 0 ? (
                <p className="text-muted text-center py-3">No programs yet. Click &quot;Add Program&quot; to create one.</p>
              ) : (
                programsList.map((program) => (
                  <Card key={program.id} className="mb-3 border-0 border-top">
                    <Card.Body>
                      <Row className="gy-3">
                        <Col md={6}>
                          <Form.Group controlId={`program-name-${program.id}`}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={program.name} onChange={(event) => handleProgramFieldChange(program.id, 'name', event.target.value)} placeholder="Program name" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId={`program-slug-${program.id}`}>
                            <Form.Label>Slug</Form.Label>
                            <Form.Control type="text" value={program.slug} onChange={(event) => handleProgramFieldChange(program.id, 'slug', event.target.value)} placeholder="program-slug" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId={`program-type-${program.id}`}>
                            <Form.Label>Program Type</Form.Label>
                            <Form.Select value={program.programType} onChange={(event) => handleProgramFieldChange(program.id, 'programType', event.target.value)}>
                              {PROGRAM_TYPE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId={`program-order-${program.id}`}>
                            <Form.Label>Display Order</Form.Label>
                            <Form.Control type="number" value={program.order} onChange={(event) => handleProgramFieldChange(program.id, 'order', Number(event.target.value))} />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group controlId={`program-short-${program.id}`}>
                            <Form.Label>Short Description</Form.Label>
                            <Form.Control as="textarea" rows={2} value={program.shortDescription} onChange={(event) => handleProgramFieldChange(program.id, 'shortDescription', event.target.value)} />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group controlId={`program-description-${program.id}`}>
                            <Form.Label>Full Description</Form.Label>
                            <Form.Control as="textarea" rows={4} value={program.description} onChange={(event) => handleProgramFieldChange(program.id, 'description', event.target.value)} />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group controlId={`program-features-${program.id}`}>
                            <Form.Label>Features (one per line)</Form.Label>
                            <Form.Control as="textarea" rows={3} value={program.featuresText} onChange={(event) => handleProgramFieldChange(program.id, 'featuresText', event.target.value)} />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Check type="switch" id={`program-active-${program.id}`} label="Active" checked={program.isActive} onChange={(event) => handleProgramFieldChange(program.id, 'isActive', event.target.checked)} />
                        </Col>
                        <Col md={12} className="d-flex justify-content-end gap-2">
                          <Button variant="primary" size="sm" onClick={() => handleProgramSave(program)} disabled={programSavingId === program.id}>
                            {programSavingId === program.id ? 'Saving...' : 'Save'}
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => requestProgramDelete(program)}>
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {submissionsError && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setSubmissionsError('')}>
          <Alert.Heading>Error Loading Submissions</Alert.Heading>
          <div style={{ whiteSpace: 'pre-line' }}>{submissionsError}</div>
          <hr />
          <p className="mb-0 small">{submissionsNote}</p>
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
                            <div style={{ maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{submission.message || 'N/A'}</div>
                          </td>
                          <td>{formatDate(submission.created_at || submission.submitted_at || submission.date)}</td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>
                                setDeleteModal({
                                  show: true,
                                  type: 'contact',
                                  id: submission.id,
                                  name: submission.name || submission.email,
                                })
                              }
                            >
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
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>
                                setDeleteModal({
                                  show: true,
                                  type: 'newsletter',
                                  id: subscription.id,
                                  name: subscription.email || `${subscription.firstName || subscription.first_name || ''} ${subscription.lastName || subscription.last_name || ''}`.trim(),
                                })
                              }
                            >
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
      <Modal show={deleteModal.show} onHide={handleDeleteCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteModal.type === 'program' ? 'Are you sure you want to delete this program?' : 'Are you sure you want to delete this submission?'}
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
