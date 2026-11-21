# Syncing progress between laptop and phone

Progress (vocabulary boxes, character drill stats and the vocabulary size) is stored in your own Google Sheet. Each device keeps a copy and merges with the sheet. When the same word was practised on two devices, the newer result wins.

## One-time setup (about 5 minutes)

1. Create a new Google Sheet, for example "Amharic progress".
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the code there and paste in the whole of `sync_apps_script.gs`.
4. On the line `const TOKEN = "change-me-to-a-secret-word";`, replace the text with your own secret word (letters and numbers, at least 12 characters). Save.
5. Click **Deploy → New deployment**. Under the gear, pick **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   Click **Deploy** and allow the permissions Google asks for. Google may say the app is unverified. Choose **Advanced → Go to … (unsafe)**: it is your own script.
6. Copy the **Web app URL**. It ends in `/exec`.

## On your laptop

1. Open the practice page and click **☁ sync: off** in the top right.
2. Paste the web-app URL and your secret word, then click **Save and sync now**. Your existing progress is uploaded.
3. Click **Copy setup link for my phone** and send the link to yourself (AirDrop, Notes, or a message to yourself).

## On your phone

Open the setup link once. Sync is now on there too. You can add the page to your home screen (Safari: Share → Add to Home Screen).

## Notes

- The page syncs when it opens, a few seconds after you answer, and when you switch back to it.
- "Who has access: Anyone" means anyone who knows the URL can reach the script, but it only reads or writes with the correct secret word.
- If you change the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.
