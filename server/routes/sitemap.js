const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Category = require('../models/Category');

// @desc    Dynamic XML Sitemap generator
// @route   GET /sitemap.xml
// @access  Public
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.CLIENT_URL || 'https://flyertech.com';

    let posts = [];
    let categories = [];
    try {
      posts = await Post.find({ status: 'published' }).select('slug updatedAt publishedAt');
      categories = await Category.find().select('slug updatedAt');
    } catch {
      // Return static sitemap if DB is offline
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blogs</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

    // Add category URLs
    categories.forEach((cat) => {
      xml += `
  <url>
    <loc>${baseUrl}/blogs?category=${cat.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add article URLs
    posts.forEach((post) => {
      const lastmod = (post.updatedAt || post.publishedAt || new Date())
        .toISOString()
        .split('T')[0];
      xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;

