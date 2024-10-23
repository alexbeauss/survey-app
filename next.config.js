/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vos autres configurations existantes
  reactStrictMode: true,
  // ...

  images: {
    domains: ['lh3.googleusercontent.com','s.gravatar.com'],
  },
}

module.exports = nextConfig
