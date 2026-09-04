/**
 * The OER Promptbook — privacy-safe public community feed (compatible version)
 *
 * SECURITY MODEL
 * 1. Form responses remain private in the response spreadsheet.
 * 2. A prompt is never public unless the maintainer explicitly marks
 *    "Approved for Public Display" as YES/TRUE/APPROVED/PUBLISH.
 * 3. The web app returns only an explicit allowlist of public fields.
 * 4. Prompt IDs are generated from timestamp + title, so no private row ID,
 *    email address, or Google account identifier is exposed.
 * 5. The front end requires feedVersion: 2 and approved: true.
 * 6. If required sheets/headers are missing, the feed fails closed.
 */

const CONFIG = Object.freeze({
  PROMPTS_SHEET: 'Prompt Submissions',
  FEEDBACK_SHEET: 'Prompt Feedback',
  REPORTS_SHEET: 'Prompt Reports',
  APPROVAL_COLUMN: 'Approved for Public Display',
  FEED_VERSION: 2,
  MAX_PUBLIC_RECORDS: 500,
  AUTO_HIDE_REPORT_COUNT: 3,

  FIELDS: Object.freeze({
    TIMESTAMP: 'Timestamp',
    TITLE: 'Prompt title',
    PURPOSE: 'What does this prompt help someone do?',
    AUDIENCE: 'Audience',
    TASK: 'Task',
    DISCIPLINE: 'Discipline',
    PROMPT: 'Prompt',
    TESTED_WITH: 'Tested with',
    EXPERIENCE: 'What happened when you tried it?',
    DISPLAY_NAME: 'Display name',
    INSTITUTION: 'College or organization',
    PERMISSION: 'Permission to share',
    PRIVACY_CHECK: 'Privacy check'
  }),

  FEEDBACK_FIELDS: Object.freeze({
    PROMPT_ID: 'Prompt ID',
    WORKED: 'Did this prompt work for you?',
    SAVED_TIME: 'Did it save you time?'
  }),

  REPORT_FIELDS: Object.freeze({
    PROMPT_ID: 'Prompt ID'
  }),

  PERMISSION_ACCEPTED_TEXT:
    'I created or adapted this submission and give permission for it to be publicly shared.',
  PRIVACY_ACCEPTED_TEXT:
    'I removed student information and other confidential or sensitive information.',
  WORKED_YES_TEXT: 'Yes',
  SAVED_TIME_VALUES: Object.freeze(['A little', 'A lot']),

  LIMITS: Object.freeze({
    title: 180,
    purpose: 1200,
    audience: 120,
    task: 120,
    discipline: 160,
    testedWith: 120,
    prompt: 20000,
    experience: 2000,
    displayName: 120,
    institution: 180,
    submittedDate: 40
  })
});

function doGet() {
  try {
    return jsonResponse_({
      feedVersion: CONFIG.FEED_VERSION,
      generatedAt: new Date().toISOString(),
      prompts: buildApprovedPublicPrompts_()
    });
  } catch (error) {
    console.error(error);
    // Fail closed: never echo spreadsheet contents or detailed errors publicly.
    return jsonResponse_({
      feedVersion: CONFIG.FEED_VERSION,
      generatedAt: new Date().toISOString(),
      prompts: [],
      error: 'Feed unavailable'
    });
  }
}

function buildApprovedPublicPrompts_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Spreadsheet unavailable.');

  const promptSheet = requireSheet_(ss, CONFIG.PROMPTS_SHEET);
  const feedbackSheet = optionalSheet_(ss, CONFIG.FEEDBACK_SHEET);
  const reportsSheet = optionalSheet_(ss, CONFIG.REPORTS_SHEET);

  requireHeaders_(promptSheet, [
    CONFIG.FIELDS.TIMESTAMP,
    CONFIG.FIELDS.TITLE,
    CONFIG.FIELDS.PURPOSE,
    CONFIG.FIELDS.PROMPT,
    CONFIG.FIELDS.PERMISSION,
    CONFIG.FIELDS.PRIVACY_CHECK,
    CONFIG.APPROVAL_COLUMN
  ]);

  const promptRows = sheetObjects_(promptSheet);
  const feedbackRows = feedbackSheet ? sheetObjects_(feedbackSheet) : [];
  const reportRows = reportsSheet ? sheetObjects_(reportsSheet) : [];

  const feedbackById = summarizeFeedback_(feedbackRows);
  const reportsById = summarizeReports_(reportRows);
  const prompts = [];

  for (const row of promptRows) {
    if (!isApproved_(row[CONFIG.APPROVAL_COLUMN])) continue;

    const promptId = makePromptId_(row);
    if (!isSafeId_(promptId)) continue;

    if (!passesPublicationGuardrails_(row, promptId, reportsById)) continue;

    const feedback = feedbackById[promptId] || {
      workedCount: 0,
      savedTimeCount: 0
    };

    const item = {
      approved: true,
      id: promptId,
      title: safeText_(row[CONFIG.FIELDS.TITLE], CONFIG.LIMITS.title),
      purpose: safeText_(row[CONFIG.FIELDS.PURPOSE], CONFIG.LIMITS.purpose),
      audience: safeText_(row[CONFIG.FIELDS.AUDIENCE], CONFIG.LIMITS.audience),
      task: safeText_(row[CONFIG.FIELDS.TASK], CONFIG.LIMITS.task),
      discipline:
        safeText_(row[CONFIG.FIELDS.DISCIPLINE], CONFIG.LIMITS.discipline) ||
        'All disciplines',
      testedWith: safeText_(row[CONFIG.FIELDS.TESTED_WITH], CONFIG.LIMITS.testedWith),
      prompt: safeText_(row[CONFIG.FIELDS.PROMPT], CONFIG.LIMITS.prompt),
      experience: safeText_(row[CONFIG.FIELDS.EXPERIENCE], CONFIG.LIMITS.experience),
      displayName: safeText_(row[CONFIG.FIELDS.DISPLAY_NAME], CONFIG.LIMITS.displayName),
      institution: safeText_(row[CONFIG.FIELDS.INSTITUTION], CONFIG.LIMITS.institution),
      submittedDate: toDateString_(row[CONFIG.FIELDS.TIMESTAMP]),
      workedCount: safeCount_(feedback.workedCount),
      savedTimeCount: safeCount_(feedback.savedTimeCount)
    };

    if (!item.title || !item.prompt) continue;
    prompts.push(item);
    if (prompts.length >= CONFIG.MAX_PUBLIC_RECORDS) break;
  }

  prompts.sort((a, b) => String(b.submittedDate).localeCompare(String(a.submittedDate)));
  return prompts;
}

function passesPublicationGuardrails_(row, promptId, reportsById) {
  const title = safeText_(row[CONFIG.FIELDS.TITLE], CONFIG.LIMITS.title);
  const purpose = safeText_(row[CONFIG.FIELDS.PURPOSE], CONFIG.LIMITS.purpose);
  const rawPrompt = String(row[CONFIG.FIELDS.PROMPT] || '');
  const prompt = safeText_(rawPrompt, CONFIG.LIMITS.prompt);

  if (!title || !purpose || !prompt) return false;
  if (rawPrompt.length > CONFIG.LIMITS.prompt) return false;

  const permission = String(row[CONFIG.FIELDS.PERMISSION] || '').trim();
  if (!answerContains_(permission, CONFIG.PERMISSION_ACCEPTED_TEXT)) return false;

  const privacyCheck = String(row[CONFIG.FIELDS.PRIVACY_CHECK] || '').trim();
  if (!answerContains_(privacyCheck, CONFIG.PRIVACY_ACCEPTED_TEXT)) return false;

  // Keep obvious contact details out of the public prompt body even after approval.
  if (containsEmail_(rawPrompt)) return false;
  if (containsLikelyPhone_(rawPrompt)) return false;

  if (
    CONFIG.AUTO_HIDE_REPORT_COUNT > 0 &&
    (reportsById[promptId] || 0) >= CONFIG.AUTO_HIDE_REPORT_COUNT
  ) {
    return false;
  }

  return true;
}

function makePromptId_(row) {
  const timestamp = String(row[CONFIG.FIELDS.TIMESTAMP] || '');
  const title = String(row[CONFIG.FIELDS.TITLE] || '');
  if (!timestamp || !title) return '';

  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    timestamp + '|' + title,
    Utilities.Charset.UTF_8
  );

  const hex = digest
    .slice(0, 5)
    .map(byte => {
      const value = byte < 0 ? byte + 256 : byte;
      return value.toString(16).padStart(2, '0');
    })
    .join('')
    .toUpperCase();

  return 'CP-' + hex;
}

function summarizeFeedback_(rows) {
  const result = {};

  for (const row of rows) {
    const id = safeText_(row[CONFIG.FEEDBACK_FIELDS.PROMPT_ID], 64);
    if (!isSafeId_(id)) continue;

    if (!result[id]) result[id] = { workedCount: 0, savedTimeCount: 0 };

    if (String(row[CONFIG.FEEDBACK_FIELDS.WORKED] || '').trim() === CONFIG.WORKED_YES_TEXT) {
      result[id].workedCount++;
    }

    const saved = String(row[CONFIG.FEEDBACK_FIELDS.SAVED_TIME] || '').trim();
    if (CONFIG.SAVED_TIME_VALUES.includes(saved)) result[id].savedTimeCount++;
  }

  return result;
}

function summarizeReports_(rows) {
  const result = {};

  for (const row of rows) {
    const id = safeText_(row[CONFIG.REPORT_FIELDS.PROMPT_ID], 64);
    if (!isSafeId_(id)) continue;
    result[id] = (result[id] || 0) + 1;
  }

  return result;
}

function sheetObjects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(value => String(value || '').trim());
  return values.slice(1)
    .filter(row => row.some(cell => String(cell || '').trim() !== ''))
    .map(row => {
      const object = {};
      headers.forEach((header, index) => {
        if (header) object[header] = row[index];
      });
      return object;
    });
}

function requireHeaders_(sheet, requiredHeaders) {
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet
    .getRange(1, 1, 1, lastColumn)
    .getDisplayValues()[0]
    .map(value => String(value || '').trim());

  const missing = requiredHeaders.filter(header => !headers.includes(header));
  if (missing.length) throw new Error('Required public-feed headers are missing.');
}

function requireSheet_(ss, name) {
  const sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error('Required sheet not found.');
  return sheet;
}

function optionalSheet_(ss, name) {
  return ss.getSheetByName(name);
}

function isApproved_(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return ['yes', 'true', 'approved', 'publish', 'published', '1'].includes(normalized);
}

function safeText_(value, maxLength) {
  return String(value === null || value === undefined ? '' : value)
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, maxLength || 1000);
}

function safeCount_(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return 0;
  return Math.min(Math.floor(number), 1000000);
}

function isSafeId_(value) {
  return /^CP-[A-F0-9]{10}$/.test(String(value || ''));
}

function answerContains_(response, requiredText) {
  return String(response || '')
    .split(',')
    .map(part => part.trim())
    .includes(requiredText);
}

function containsEmail_(text) {
  return /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(String(text || ''));
}

function containsLikelyPhone_(text) {
  return /(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/.test(String(text || ''));
}

function toDateString_(value) {
  if (!value) return '';
  let date = value;
  if (!(date instanceof Date)) date = new Date(value);
  if (isNaN(date.getTime())) return '';
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional diagnostic helper. Running this manually writes no data.
 * It only reports whether the expected sheets and approval column exist.
 */
function checkPrivacySetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss && ss.getSheetByName(CONFIG.PROMPTS_SHEET);
  if (!sheet) {
    Logger.log('Prompt Submissions sheet not found.');
    return false;
  }

  const headers = sheet
    .getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1))
    .getDisplayValues()[0]
    .map(value => String(value || '').trim());

  const ok = headers.includes(CONFIG.APPROVAL_COLUMN);
  Logger.log(ok
    ? 'Privacy setup looks ready.'
    : 'Add a column named exactly: ' + CONFIG.APPROVAL_COLUMN);
  return ok;
}
