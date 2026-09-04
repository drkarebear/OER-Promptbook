# Accessibility

The OER Promptbook is designed with accessibility as a core requirement. The project aims to meet or exceed WCAG 2.2 Level AA for the parts of the experience controlled by this repository.

For U.S. state and local government web content, the U.S. Department of Justice Title II rule identifies WCAG 2.1 Level AA as the technical standard. This project uses WCAG 2.2 Level AA as its design and testing target because WCAG 2.2 retains the earlier requirements and adds newer accessibility criteria.

## Accessibility Features

The site includes:

- semantic headings and HTML landmarks;
- one clear page-level heading on each page;
- skip links that move keyboard focus to the beginning of the main content, including the page title;
- keyboard-accessible navigation and controls;
- visible high-contrast focus indicators;
- descriptive link and control names;
- accessible names for repeated copy buttons and dynamic community actions;
- live status announcements for copy actions, filtering, and dynamic community content;
- explicit list semantics where visual list markers are removed;
- responsive reflow without horizontal page scrolling at a 320 CSS-pixel viewport;
- controls that meet a 44 by 44 CSS-pixel minimum target in tested layouts;
- reduced-motion support when smooth scrolling is used;
- text and control contrast designed to meet WCAG AA thresholds;
- text that remains usable under 200% text resizing and WCAG text-spacing stress tests; and
- a third-party community showcase that loads only on user request, plus a direct-link alternative.

## September 2026 Audit

A repository-wide accessibility pass checked all HTML pages for:

- heading and landmark structure;
- skip-link behavior;
- accessible names and ARIA references;
- duplicate IDs;
- image alternative text;
- iframe titles;
- keyboard target size;
- text/background contrast;
- focus-indicator contrast;
- 320 CSS-pixel reflow;
- 200% text resizing;
- WCAG text-spacing resilience;
- reduced-motion support;
- browser accessibility-tree names for interactive elements;
- internal link and anchor integrity; and
- inline JavaScript syntax.

No known first-party errors remained in those repository-level checks after the September 2026 accessibility pass. The site is also structured to avoid common WAVE errors and contrast errors. Because WAVE evaluates the rendered page and accessibility conformance always requires human judgment, the deployed site should still be rechecked with the WAVE browser extension after each significant update.

## WAVE Check After Deployment

After publishing a significant update, run the WAVE browser extension on the deployed pages and review the rendered result. The goal for first-party Promptbook code is **0 WAVE Errors and 0 Contrast Errors**. WAVE Alerts are prompts for human review rather than automatic failures; each alert should be checked in context. Also complete a keyboard-only pass because no automated scanner can establish WCAG conformance by itself.

Recommended spot checks after deployment:

- Tab through the header, page controls, copy buttons, and footer in a logical order.
- Activate **Skip to main content** and confirm focus moves to the main content.
- Confirm every focused control remains visible and unobscured.
- Zoom browser content to 200% and test a narrow/mobile viewport for reflow.
- On the Community page, test filters and copy-status announcements with a screen reader when practical.
- Treat accessibility findings inside Google Forms, Padlet, or other third-party services as provider-controlled issues and keep a direct-link alternative where practical.

## Third-Party Services

The Promptbook links to or embeds services maintained by other providers, including Google Forms, Padlet, and external AI tools. Their accessibility can change independently of this repository. Where practical, the Promptbook provides a direct link as an alternative to embedded third-party content.

## Report an Accessibility Barrier

If you encounter an accessibility problem in the Promptbook itself, email Karen Crozer at karencrozer@gmail.com and include the page and a short description of the barrier if possible.

## References

- W3C Web Content Accessibility Guidelines (WCAG) 2.2: https://www.w3.org/TR/WCAG22/
- U.S. Department of Justice ADA Title II web accessibility information: https://www.ada.gov/resources/2024-03-08-web-rule/
