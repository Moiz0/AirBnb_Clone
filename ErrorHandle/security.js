const helmet = require("helmet");

function applySecurityMiddleware(app) {
  // Enhanced Helmet configuration for production
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://stackpath.bootstrapcdn.com",
            "https://cdn.jsdelivr.net",
            "https://fonts.googleapis.com",
          ],
          scriptSrc: [
            "'self'",
            "https://stackpath.bootstrapcdn.com",
            "https://cdn.jsdelivr.net",
            "https://code.jquery.com",
          ],
          fontSrc: [
            "'self'",
            "https://fonts.gstatic.com",
            "https://stackpath.bootstrapcdn.com",
          ],
          imgSrc: [
            "'self'",
            "data:",
            "https://res.cloudinary.com",
            "https://images.unsplash.com",
          ],
          connectSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false, // Disable if causing issues
      referrerPolicy: { policy: "same-origin" },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  // Additional security headers
  app.use((req, res, next) => {
    // Prevent clickjacking
    res.setHeader("X-Frame-Options", "DENY");

    // Prevent MIME type sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");

    // XSS Protection
    res.setHeader("X-XSS-Protection", "1; mode=block");

    // Referrer Policy
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Permissions Policy
    res.setHeader(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=()"
    );

    next();
  });
}

module.exports = applySecurityMiddleware;
