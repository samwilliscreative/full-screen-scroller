module.exports = {
  "site": "Swillis", // The site/project name. This is used mostly for seo purposes (meta tags & alt text).
  "brand-path": "swillis", // A url friendly name of the site. Used in logo paths and other branded links.
  "img": { // Only use {{img}} when entering a path for your assets, the build script will automatically fill in local/remote depending on the task you are running.
    "local": "/images",
    "remote": "https://swillis.co.uk/images"
  },
  "dist": {
    "local": "/dist",
    "remote": "https://swillis.co.uk/dist"
  }
};
  