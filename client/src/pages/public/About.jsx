import React from 'react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/common/SEO';
import Badge from '../../components/common/Badge';
import Icon from '../../components/common/Icon';
import { COMPANY_INFO, CATEGORIES } from '../../utils/constants';
import './About.css';

export default function About() {
  return (
    <Layout>
      <SEO
        title="About FlyerTech - Enterprise Technology & Engineering Editorial"
        description="Learn about FlyerTech's editorial mission, technical coverage domains, and practitioner contributors."
      />
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <Badge variant="blue" size="md">About FlyerTech</Badge>
            <h1 className="about-title">Enterprise Technology & Engineering Editorial</h1>
            <p className="about-subtitle">
              {COMPANY_INFO.tagline}
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="about-content container">
          <div className="about-grid">
            <div className="about-card">
              <div className="card-icon-box">
                <Icon name="tag" size={24} color="var(--color-primary)" />
              </div>
              <h3>Rigorous Technical Depth</h3>
              <p>
                We publish architectural blueprints, deep system design reviews, code analysis, and production post-mortems curated for software leaders and engineers.
              </p>
            </div>

            <div className="about-card">
              <div className="card-icon-box">
                <Icon name="check" size={24} color="#15803D" />
              </div>
              <h3>Editorial Integrity</h3>
              <p>
                Our articles are researched, vendor-neutral, and grounded in real-world software engineering practices. We do not use automated watermarks or unverified content.
              </p>
            </div>

            <div className="about-card">
              <div className="card-icon-box">
                <Icon name="user" size={24} color="var(--color-primary)" />
              </div>
              <h3>Practitioner Authored</h3>
              <p>
                Written by seasoned engineers, cloud architects, security researchers, and data scientists actively shipping production systems.
              </p>
            </div>
          </div>

          {/* Topics Covered */}
          <div className="about-topics-section">
            <h2>Our Core Coverage Domains</h2>
            <p className="topics-lead">
              FlyerTech covers the entire spectrum of modern digital engineering:
            </p>
            <div className="topics-tags-wrap">
              {CATEGORIES.map((cat) => (
                <Badge key={cat.id} variant="gray" size="md">
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

