import { useEffect } from 'react';

/**
 * Reusable SEO component for managing document title, meta tags, Open Graph,
 * Twitter Cards, canonical links, and Schema.org JSON-LD structured data.
 */
export default function SEO({
  title = 'FlyerTech - Enterprise Technology & Software Architecture Blog',
  description = 'In-depth engineering perspectives, distributed architecture, AI systems, and cybersecurity insights written by practitioners.',
  keywords = 'software development, microservices, artificial intelligence, cloud computing, cybersecurity, distributed systems',
  image = '/flyertech-logo.svg',
  url = window.location.href,
  type = 'website',
  article = null, // { publishedAt, authorName, tags }
}) {
  const fullTitle = title.includes('FlyerTech') ? title : `${title} | FlyerTech`;
  const canonicalUrl = url || window.location.href;
  const imageUrl = image?.startsWith('http')
    ? image
    : `${window.location.origin}${image?.startsWith('/') ? '' : '/'}${image}`;

  useEffect(() => {
    // 1. Set document title
    document.title = fullTitle;

    // Helper: update or create meta tag
    const setMeta = (name, content, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content || '');
    };

    // Standard Meta Tags
    setMeta('description', description);
    setMeta('keywords', keywords);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Open Graph
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:image', imageUrl, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', type, true);
    setMeta('og:site_name', 'FlyerTech', true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', imageUrl);

    // JSON-LD Structured Data
    const scriptId = 'flyertech-jsonld-schema';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    let schemaData;
    if (type === 'article' && article) {
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: description,
        image: imageUrl,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        author: {
          '@type': 'Person',
          name: article.authorName || 'FlyerTech Editorial',
        },
        publisher: {
          '@type': 'Organization',
          name: 'FlyerTech',
          logo: {
            '@type': 'ImageObject',
            url: `${window.location.origin}/flyertech-logo.svg`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        keywords: article.tags?.join(', ') || keywords,
      };
    } else {
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'FlyerTech',
        url: window.location.origin,
        description: description,
        publisher: {
          '@type': 'Organization',
          name: 'FlyerTech',
          logo: `${window.location.origin}/flyertech-logo.svg`,
        },
      };
    }

    script.textContent = JSON.stringify(schemaData);

    return () => {
      // Clean up script on unmount
      const existing = document.getElementById(scriptId);
      if (existing) {
        existing.remove();
      }
    };
  }, [fullTitle, description, keywords, imageUrl, canonicalUrl, type, article]);

  return null;
}

