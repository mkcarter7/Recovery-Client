'use client';

import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { apiClient } from '@/api/client';

const STORY_DEFAULTS = {
  heading: 'Our Story',
  body: `2nd Chance Recovery was founded on the belief that everyone deserves access to quality recovery and treatment services, regardless of their circumstances. We understand that the journey to recovery is deeply personal and unique to each individual.

Nestled in the rolling hills of beautiful Cheatham County, Tennessee, we've created a sanctuary where clinical expertise meets nature's restorative power. Our approach goes far beyond traditional treatment, offering a healing environment that addresses the mind, body, and spirit.

We believe recovery is about more than sobriety – it's about living a life you're proud of. That's why our programs are tailored to meet unique needs, offering structure, support, and connection every step of the way.

Our mission is to provide immediate, accessible, and effective treatment for individuals struggling with substance use disorder, while also building a supportive community that extends far beyond the treatment period.`,
};

const getContentValue = (content, key, fallback) => {
  if (!content || typeof content !== 'object') {
    return fallback;
  }
  const value = content[key];
  return value === undefined || value === null || value === '' ? fallback : value;
};

function OurStory() {
  const [storyContent, setStoryContent] = useState(STORY_DEFAULTS);

  useEffect(() => {
    let isMounted = true;

    const fetchStory = async () => {
      try {
        const siteContent = await apiClient.getSiteContent().catch(() => ({}));
        if (!isMounted) return;

        setStoryContent({
          heading: getContentValue(siteContent, 'story_heading', STORY_DEFAULTS.heading),
          body: getContentValue(siteContent, 'story_body', STORY_DEFAULTS.body),
        });
      } catch (error) {
        console.error('Error loading story content:', error);
        if (isMounted) {
          setStoryContent(STORY_DEFAULTS);
        }
      }
    };

    fetchStory();

    return () => {
      isMounted = false;
    };
  }, []);

  const storyParagraphs = useMemo(() => {
    if (!storyContent.body) {
      return [];
    }
    return storyContent.body.split(/\n\s*\n/).filter(Boolean);
  }, [storyContent.body]);

  return (
    <Container className="py-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <h1 className="text-center mb-5">{storyContent.heading}</h1>

          <Card className="mb-5 shadow-sm">
            <Card.Body>
              {storyParagraphs.length > 0 ? (
                storyParagraphs.map((paragraph) => (
                  <p key={paragraph} className={paragraph === storyParagraphs[0] ? 'lead' : undefined}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="lead">Our story content will appear here soon.</p>
              )}
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
