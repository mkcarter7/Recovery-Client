'use client';

import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import { apiClient } from '@/api/client';

const HERO_DEFAULTS = {
  backgroundGradient: 'linear-gradient(135deg, #000000 0%, #8b0000 50%, #dc3545 100%)',
  headline: 'Find Your Path to Recovery',
  subheadline: 'WHO WE ARE ARE WHERE WE ARE LOCATED',
  description: 'At 2nd Chance Recovery, WHAT WE BELIEVE',
  primaryCtaText: 'Get Started',
  primaryCtaHref: '/contact',
  secondaryCtaText: 'Learn More',
  secondaryCtaHref: '/programs/php-housing',
};

const CONTACT_DEFAULTS = {
  blurb: 'Everyone deserves access to quality recovery and treatment services, regardless of their financial situation.',
};

const getContentValue = (content, key, fallback = '') => {
  if (!content || typeof content !== 'object') {
    return fallback;
  }
  const value = content[key];
  return value === undefined || value === null || value === '' ? fallback : value;
};

function mapHeroContent(contentMap) {
  return {
    backgroundGradient: getContentValue(contentMap, 'hero_background_gradient', HERO_DEFAULTS.backgroundGradient),
    headline: getContentValue(contentMap, 'hero_headline', HERO_DEFAULTS.headline),
    subheadline: getContentValue(contentMap, 'hero_subheadline', HERO_DEFAULTS.subheadline),
    description: getContentValue(contentMap, 'hero_description', HERO_DEFAULTS.description),
    primaryCtaText: getContentValue(contentMap, 'hero_primary_cta_text', HERO_DEFAULTS.primaryCtaText),
    primaryCtaHref: getContentValue(contentMap, 'hero_primary_cta_href', HERO_DEFAULTS.primaryCtaHref),
    secondaryCtaText: getContentValue(contentMap, 'hero_secondary_cta_text', HERO_DEFAULTS.secondaryCtaText),
    secondaryCtaHref: getContentValue(contentMap, 'hero_secondary_cta_href', HERO_DEFAULTS.secondaryCtaHref),
  };
}

function mapContactContent(contentMap) {
  return {
    blurb: getContentValue(contentMap, 'contact_blurb', CONTACT_DEFAULTS.blurb),
  };
}

function Home() {
  const [programs, setPrograms] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [heroContent, setHeroContent] = useState(HERO_DEFAULTS);
  const [contactContent, setContactContent] = useState(CONTACT_DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [programsData, testimonialsData, siteContentData] = await Promise.all([apiClient.getPrograms().catch(() => []), apiClient.getTestimonials().catch(() => []), apiClient.getSiteContent().catch(() => ({}))]);

        setPrograms(Array.isArray(programsData) ? programsData : []);
        setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
        setHeroContent(mapHeroContent(siteContentData));
        setContactContent(mapContactContent(siteContentData));
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        setHeroContent(HERO_DEFAULTS);
        setContactContent(CONTACT_DEFAULTS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroButtons = useMemo(
    () =>
      [
        heroContent.primaryCtaText
          ? {
              text: heroContent.primaryCtaText,
              href: heroContent.primaryCtaHref || HERO_DEFAULTS.primaryCtaHref,
              variant: 'light',
            }
          : null,
        heroContent.secondaryCtaText
          ? {
              text: heroContent.secondaryCtaText,
              href: heroContent.secondaryCtaHref || HERO_DEFAULTS.secondaryCtaHref,
              variant: 'outline-light',
            }
          : null,
      ].filter(Boolean),
    [heroContent.primaryCtaHref, heroContent.primaryCtaText, heroContent.secondaryCtaHref, heroContent.secondaryCtaText],
  );

  return (
    <>
      {/* Hero Section */}
      <section
        className="text-white py-5"
        style={{
          background: heroContent.backgroundGradient,
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">{heroContent.headline}</h1>
              {heroContent.subheadline && <p className="lead mb-4">{heroContent.subheadline}</p>}
              {heroContent.description && <p className="mb-4">{heroContent.description}</p>}
              <div className="d-flex gap-3 flex-wrap">
                {heroButtons.map((btn) => (
                  <Link key={btn.text} href={btn.href}>
                    <Button variant={btn.variant} size="lg">
                      {btn.text}
                    </Button>
                  </Link>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Programs Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">WHAT WE OFFER</h2>
          {loading ? (
            <div className="text-center py-5">
              <p>Loading programs...</p>
            </div>
          ) : (
            <Row>
              {programs.length > 0 ? (
                programs.map((program) => (
                  <Col md={4} key={program.id} className="mb-4">
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title className="h4 mb-3">{program.name}</Card.Title>
                        <Card.Text>{program.short_description || program.description || 'No description available.'}</Card.Text>
                        <Link href={`/programs/${program.slug || program.id}`}>
                          <Button variant="primary">Learn More</Button>
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                // Fallback static content
                <>
                  <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title className="h4 mb-3">HOUSING</Card.Title>
                        <Card.Text>DESCRIPTION</Card.Text>
                        <Link href="/programs/php-housing">
                          <Button variant="primary">Learn More</Button>
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title className="h4 mb-3">Intensive Outpatient Program</Card.Title>
                        <Card.Text>WHAT IT IS</Card.Text>
                        <Link href="/programs/iop">
                          <Button variant="primary">Learn More</Button>
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title className="h4 mb-3">3</Card.Title>
                        <Card.Text>DESCRIPTION</Card.Text>
                        <Link href="/programs/3">
                          <Button variant="primary">Learn More</Button>
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                </>
              )}
            </Row>
          )}
        </Container>
      </section>

      {/* Activities/Therapeutic Services */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">The 2nd Chance Recovery Difference</h2>
          <p className="text-center mb-5 lead">WHAT THERAPY IS OFFERED</p>
          <Row>
            {[
              { title: '1', desc: 'XXXX.' },
              { title: '2', desc: 'XXX' },
              { title: '3', desc: 'XXX' },
              { title: '4', desc: 'XXX' },
              { title: '5', desc: 'XXX' },
              { title: '6', desc: 'XXX' },
            ].map((activity) => (
              <Col md={4} key={activity.title} className="mb-4">
                <Card className="h-100 border-0">
                  <Card.Body className="text-center">
                    <Card.Title className="h5">{activity.title}</Card.Title>
                    <Card.Text>{activity.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-5">
          <Container>
            <h2 className="text-center mb-5">What Our Community Says</h2>
            <Row>
              {testimonials.slice(0, 3).map((testimonial) => (
                <Col md={4} key={testimonial.id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <Card.Text className="fst-italic">&ldquo;{testimonial.quote}&rdquo;</Card.Text>
                      <Card.Text className="text-muted small mt-3">— {testimonial.author}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* Call to Action */}
      <section
        className="py-5 text-white text-center"
        style={{
          background: heroContent.backgroundGradient,
        }}
      >
        <Container>
          <h2 className="mb-4">Start Here</h2>
          {contactContent.blurb && <p className="lead mb-4">{contactContent.blurb}</p>}
          <Link href="/contact">
            <Button variant="light" size="lg">
              Call Us Today
            </Button>
          </Link>
        </Container>
      </section>
    </>
  );
}

export default Home;
