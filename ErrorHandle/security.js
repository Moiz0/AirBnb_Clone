const helmet = require("helmet");

function applySecurityMiddleware(app) {
  // Enhanced Helmet configuration for production
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"], // Ensure this is not 'none'
        connectSrc: ["'self'", "https://*.cloudinary.com"], // Keep existing if needed
        scriptSrc: [
          "'self'",
          "https://stackpath.bootstrapcdn.com",
          "https://cdn.jsdelivr.net",
          "https://code.jquery.com",
          // Choose one of the following for inline scripts:
          "'unsafe-inline'", // Less secure, but quick fix. Consider removing later.
          // Or specific hash:
          // "'sha256-ZUv2T72pIJJCyY+Xs4qaqFCdYmCmrjClBkWUCxFXI6Y='" // For the specific inline script error
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://stackpath.bootstrapcdn.com",
          "https://cdn.jsdelivr.net",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com", // <-- ADDED for Font Awesome
        ],
        workerSrc: ["'self'", "blob:"],
        objectSrc: ["'none'"],
        imgSrc: [
          "'self'",
          "data:",
          "https://res.cloudinary.com",
          "https://images.unsplash.com",
          "https://plus.unsplash.com", // <-- ADDED for plus.unsplash.com images
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com", // Assuming you use Google Fonts
          "https://cdnjs.cloudflare.com", // Assuming Font Awesome fonts are from here
          "https://cdn.jsdelivr.net", // If you load fonts from jsdelivr
        ],
        // Add other directives as needed (e.g., frameSrc, mediaSrc)
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
