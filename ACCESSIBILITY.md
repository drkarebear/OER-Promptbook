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
- a titled iframe plus a direct-link alternative for the embedded community showcase.

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

No issues remained in those automated and browser-level checks after the September 2026 accessibility pass.

## Third-Party Services

The Promptbook links to or embeds services maintained by other providers, including Google Forms, Padlet, and external AI tools. Their accessibility can change independently of this repository. Where practical, the Promptbook provides a direct link as an alternative to embedded third-party content.

## Report an Accessibility Barrier

If you encounter an accessibility problem in the Promptbook itself, email Karen Crozer at karencrozer@gmail.com and include the page and a short description of the barrier if possible.

## References

- W3C Web Content Accessibility Guidelines (WCAG) 2.2: https://www.w3.org/TR/WCAG22/
- U.S. Department of Justice ADA Title II web accessibility information: https://www.ada.gov/resources/2024-03-08-web-rule/
