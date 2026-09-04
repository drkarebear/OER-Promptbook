# Security and Privacy Maintenance

The OER Promptbook is designed as a static GitHub Pages site with minimal first-party data collection.

## Public-by-Default Rule

Treat every file committed to this public repository and every value delivered to browser JavaScript as public. Never commit passwords, private API keys, service-role keys, OAuth client secrets, database credentials, access tokens, private `.env` values, or confidential data.

## Community Prompt Lab

The Community Prompt Lab is the only portion of the site that automatically requests a third-party data feed. Its publication path should remain:

**Google Form → private response sheet → maintainer approval → allowlisted Apps Script feed → public Community page**

The public front end requires feed contract version 2 and `approved: true` on every displayed record. The reference implementation is in `google-apps-script/Code.gs`.

## Third Parties

- **GitHub Pages:** hosts the site and may process ordinary web-request metadata.
- **Google Apps Script:** serves the approved community feed when the Community page is opened.
- **Google Forms:** receives voluntary prompt, feedback, and report submissions.
- **Padlet:** is click-to-load and receives no delegated camera, microphone, or geolocation permission from the Promptbook iframe.

## Browser Hardening

HTML pages include a no-referrer policy and a Content Security Policy that blocks plugins/objects, limits frames to Padlet, limits network fetches to the Google Apps Script endpoints used by the Community Lab, and limits form actions to Google Forms. Inline scripts/styles remain allowed because this static site currently uses them.

## Before Each Release

- Search the repository for tokens, passwords, email lists, student information, exports, backups, and `.env` files.
- Confirm new external scripts, embeds, fonts, analytics, or APIs are genuinely necessary before adding them.
- Confirm the Apps Script still returns only explicitly approved allowlisted fields.
- Test that an unapproved submission does not appear in the public feed or Community page.
- Review the Privacy page whenever a new third-party service or data flow is added.
- Remember that deleting a secret from the latest commit does not remove it from Git history; revoke/rotate any exposed credential.

## Git Commit Email Privacy

Git commit author email addresses are stored in Git history. Maintainers who do not want a personal email address exposed in future commits should configure Git/GitHub to use a GitHub-provided `noreply` commit address. Changing this setting affects future commits; rewriting existing public history is a separate, potentially disruptive operation.
