/**
 * Amharic Practice: progress sync
 *
 * Paste this into Extensions → Apps Script of a new Google Sheet,
 * change TOKEN below to your own secret word, then Deploy → New deployment →
 * Web app (Execute as: Me, Who has access: Anyone). See SYNC_SETUP.md.
 *
 * The sheet "progress" gets one row per item:
 *   key | value (JSON) | updated (ms) | updated (date)
 * keys: "v:<word>" vocabulary box (0–4), "c:<character>" character stats, "s:vsize" vocabulary size.
 * When two devices change the same item, the newer change wins.
 */
const TOKEN = "change-me-to-a-secret-word";
const SHEET_NAME = "progress";
const HEADER = ["key", "value", "updated (ms)", "updated"];

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return reply({ ok: false, error: "bad request" }); }
  if (body.token !== TOKEN) return reply({ ok: false, error: "wrong secret word" });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = getSheet();
    const last = sh.getLastRow();
    const rows = last > 1 ? sh.getRange(2, 1, last - 1, 4).getValues() : [];
    const index = {};
    rows.forEach((r, i) => { index[r[0]] = i; });

    let changed = false;
    (body.items || []).forEach(it => {
      if (!it || typeof it.k !== "string" || !it.k) return;
      const t = Number(it.t) || 1;
      const row = [it.k, JSON.stringify(it.v === undefined ? null : it.v), t, new Date(t)];
      const i = index[it.k];
      if (i === undefined) { index[it.k] = rows.length; rows.push(row); changed = true; }
      else if (Number(rows[i][2]) < t) { rows[i] = row; changed = true; }
    });
    if (changed && rows.length) {
      sh.getRange(2, 2, rows.length, 1).setNumberFormat("@");  // keep values as plain text
      sh.getRange(2, 1, rows.length, 4).setValues(rows);
    }
    return reply({
      ok: true,
      items: rows.map(r => {
        let v = null;
        try { v = JSON.parse(String(r[1])); } catch (err) {}
        return { k: String(r[0]), v: v, t: Number(r[2]) };
      }),
    });
  } finally {
    lock.releaseLock();
  }
}

// Opening the web-app address in a browser shows that it is running (no data is shown).
function doGet() {
  return reply({ ok: true, info: "Amharic Practice sync is running. The page sends its progress with POST." });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange(1, 1, 1, 4).setValues([HEADER]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
