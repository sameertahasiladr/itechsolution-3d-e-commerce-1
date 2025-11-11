/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // 🌐 Your live site URL
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://itechsolution.vercel.app',

  // 🗺️ Generate both sitemap.xml and robots.txt automatically
  generateRobotsTxt: true,

  // 📦 Optional settings
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,

  // 🚫 Exclude sensitive or admin routes
  exclude: ['/admin', '/api/*', '/login', '/register'],

  // 🤖 Robots.txt configuration
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/login', '/register', '/api'] },
    ],
    additionalSitemaps: [
      'https://itechsolution.vercel.app/sitemap.xml',
    ],
  },
};
