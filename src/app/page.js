'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import { apiClient } from '@/api/client';

function Home() {
  const [programs, setPrograms] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch programs and testimonials from API
        const [programsData, testimonialsData] = await Promise.all([apiClient.getPrograms().catch(() => []), apiClient.getTestimonials().catch(() => [])]);
        setPrograms(programsData);
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        className="text-white py-5"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #8b0000 50%, #dc3545 100%)',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">Find Your Path to Recovery</h1>
              <p className="lead mb-4">WHO WE ARE ARE WHERE WE ARE LOCATED</p>
              <p className="mb-4">At 2nd Chance Recovery, WHAT WE BELEIVE</p>
              <div className="d-flex gap-3 flex-wrap">
                <Link href="/contact">
                  <Button variant="light" size="lg">
                    Get Started
                  </Button>
                </Link>
                <Link href="/programs/php-housing">
                  <Button variant="outline-light" size="lg">
                    Learn More
                  </Button>
                </Link>
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
                        <Card.Title className="h4 mb-3">{program.name || program.title}</Card.Title>
                        <Card.Text>{program.description || program.desc || 'No description available.'}</Card.Text>
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
          background: 'linear-gradient(135deg, #000000 0%, #8b0000 50%, #dc3545 100%)',
        }}
      >
        <Container>
          <h2 className="mb-4">Start Here</h2>
          <p className="lead mb-4">everyone deserves access to quality recovery and treatment services, regardless of their financial situation.</p>
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
