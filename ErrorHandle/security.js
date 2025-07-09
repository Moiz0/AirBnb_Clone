// config/security.js (or middleware/security.js)

const helmet = require("helmet");

module.exports = (app) => {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://*.cloudinary.com"],
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "'unsafe-inline'", // Use with caution
        ],
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "'unsafe-inline'", // Use with caution
          "https://cdnjs.cloudflare.com", // For Font Awesome CSS
          "https://fonts.googleapis.com", // For Google Fonts CSS
        ],
        workerSrc: ["'self'", "blob:"],
        objectSrc: ["'none'"],
        imgSrc: [
          "'self'",
          "blob:",
          "data:",
          "https://res.cloudinary.com",
          "https://images.unsplash.com",
          "https://plus.unsplash.com", // For plus.unsplash.com images
        ],
        fontSrc: [
          "'self'",
          "https://cdn.jsdelivr.net", // If you load fonts from jsdelivr
          "https://fonts.gstatic.com", // For Google Fonts font files
          "https://cdnjs.cloudflare.com", // For Font Awesome font files
        ],
        // ... add any other directives you need
      },
    })
  );
  // You can add other global security middlewares here too if you have any
};
