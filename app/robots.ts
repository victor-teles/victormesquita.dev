export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
      },
    ],
    sitemap: 'https://victormesquita.dev/sitemap.xml',
    host: 'https://victormesquita.dev',
  }
}
