# Privacy-Safe Google Forms and Apps Script Setup

This folder contains the reference Apps Script used to publish the Community Prompt Lab without exposing raw form-response rows.

## Required Publication Flow

1. Keep the Google Form response spreadsheet private. Do **not** publish the spreadsheet to the web.
2. In the prompt-submission response sheet, add a maintainer-only column named exactly **Approved for Public Display**. Do not add that question to the public Google Form.
3. New rows should be blank in that column. After reviewing a submission for student names, identifiable student work, grades, accommodations, private email addresses, confidential institutional information, or other sensitive material, enter **YES** only if it is safe to publish.
4. Copy `Code.gs` into the Apps Script project attached to the response spreadsheet. Set `RESPONSE_SHEET_NAME` if your responses tab is not named `Form Responses 1`.
5. Check the field aliases in `PUBLIC_FIELDS`. If a form question uses different wording, add its exact spreadsheet column heading to the relevant alias list.
6. Deploy the script as a Web App that can be read by visitors who need to use the public Community page. The script itself exposes only approved, allowlisted display fields.
7. Replace `DATA_FEED_URL` in `community-prompts.html` with the deployed `/exec` URL if it changes.
8. Test an unapproved row: it must **not** appear in the JSON response. Then approve a harmless test row and confirm that only the intended public fields appear.

## Google Form Privacy Settings

For the prompt-submission, feedback, and report forms, use data minimization:

- Turn **Collect email addresses** off unless an email address is genuinely needed.
- Do not require Google sign-in unless there is a clear operational reason.
- Avoid **Limit to 1 response** if it forces sign-in and identity is unnecessary.
- Keep display name and institution optional. Label them clearly as information that may be shown publicly.
- Do not ask for student names, student IDs, grades, accommodations, disability information, private institutional records, or other educational records.
- If contact information is needed for a report form, keep that field private and do not add it to `PUBLIC_FIELDS`.

## Suggested Consent Language for the Submission Form

Place this immediately before submission:

> I understand that the prompt and any optional public-attribution information I submit may be published on The OER Promptbook after review. I have removed student names, identifiable student work, grades, accommodations, private email addresses, confidential institutional information, and other information that should not be public.

A required acknowledgment checkbox is recommended for prompt submissions.

## What the Public Feed Must Never Return

Do not add these to `PUBLIC_FIELDS`:

- email addresses or Google account identifiers;
- private contact information;
- raw form-response rows;
- moderation notes;
- report-form narratives intended only for the maintainer;
- internal spreadsheet IDs or administrative columns;
- student or employee records.

The front end also fails closed: it requires `feedVersion: 2`, a `prompts` array, and `approved: true` on each displayed record.
