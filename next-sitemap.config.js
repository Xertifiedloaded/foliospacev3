/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://foliospace.org.ng', 
  generateRobotsTxt: true,              
  sitemapSize: 5000,                     
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/secret', '/admin/*'],    
}
