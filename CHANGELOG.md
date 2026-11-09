# Changelog - Helping Hand Haven (WEDE5020)

This log describes the files included in this source archive.

## 9 November 2026 - Part 3 functionality and SEO

- Added JavaScript validation for names, complete email addresses, and exactly 10 phone digits. Required fields and minimum message length now prevent incomplete submissions.
- Connected the contact and enquiry forms to FormSubmit's AJAX endpoint, added loading, success, and retry feedback, and kept an email link available if the service is unavailable.
- Added a honeypot field and a note explaining that form details pass through the email service.
- Added live search and alphabetical sorting for the service sections and photo gallery.
- Added a responsive photo lightbox with full-resolution images, previous and next controls, Escape support, and keyboard navigation.
- Added small scroll-reveal transitions that are disabled when the visitor requests reduced motion.
- Added unique page keywords and improved titles and descriptions, plus `robots.txt` and `sitemap.xml` for the planned site domain.
- Updated README instructions for FormSubmit activation, local web-server testing, and changing the host URLs when publishing.

## 9 November 2026 - Rubric corrections

- Added Google Fonts links to all six pages so the stylesheet's Poppins and Open Sans choices load.
- Added a labelled checkbox navigation control to every page. The compact menu opens at widths of 1024px and below; the existing 768px and 480px layout adjustments remain in place.
- Added responsive srcset and sizes attributes to every image. Regenerated the six local photos at high quality in 480px, 800px, 1200px and 1600px sizes, expanded remote responsive image choices, and added a 1200px mobile source for the homepage hero.
- Fixed the About page's broken image reference by using the included caregivers photo.
- Improved contrast for blue text, primary buttons, table headings, the banner and keyboard focus outlines while retaining the palette.
- Corrected the About page image display size and gently brightened photos to improve their clarity.
- Added the missing sitemap diagram at images/sitemap.png.
- Corrected the classroom assignment label to formative-2-part-2 to match this project archive.
- Added shared JavaScript for Escape-to-close mobile navigation, name validation, email and phone validation, service filtering, gallery search and sort, and the photo lightbox. Valid forms submit asynchronously to the configured email service.
- Updated this README and changelog to match the actual files and features. Browser screenshot evidence is not included in this archive.

## Part 2 - Visual design

- Created a shared external stylesheet and applied the colour palette, type scale, layout, cards, forms, tables, photo grids and footer styles across six pages.
- Added responsive CSS breakpoints at 1024px, 768px and 480px.
- Added hover, focus, active, form validation, structural pseudo-class and reduced-motion styles.
- Used semantic HTML landmarks and added aria-current="page" to the active navigation item on each page.

## Part 1 - Site foundation

- Created the project structure and six semantic HTML pages with shared site navigation.
- Documented the organisation, site goals, KPIs, design proposal, budget, sitemap and technical choices in the README.


