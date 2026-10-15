# Docs Comment Warning Helper

A small Chrome and Edge extension for Google Docs, Slides, and Sheets. It hides only popups that mention comments or replies and a rate or frequency warning, then shows a reminder to check whether your comment appeared.

> **Important:** This only hides the warning in your browser. It cannot bypass Google's server-side limits or make a rejected comment post. Check the comment sidebar and repost anything missing.

## Install on a Mac

1. Download [Docs Comment Warning Helper for Mac](https://github.com/JakeATX/docs-comment-warning-helper/releases/latest/download/docs-comment-warning-helper-mac.zip) and unzip it.
2. Control-click Install.command, choose **Open**, then confirm **Open** if macOS asks.
3. The installer downloads the extension, opens Chrome's extension settings, and shows the extension folder in Finder.
4. In Chrome, turn on **Developer mode**, click **Load unpacked**, and choose the docs-comment-warning-helper folder shown in Finder.
5. Reload any open Docs, Slides, or Sheets tabs.

This quick installer removes the unzip-and-find steps. Chrome still requires **Load unpacked** for extensions installed outside the Chrome Web Store. See [Chrome Web Store installation](#chrome-web-store) below for the true one-click path.

### Chrome Web Store

A one-click **Add to Chrome** install requires a Chrome Web Store listing. This source release is not yet published there. Until that happens, use the Mac installer above.

## Install manually

1. Download comment-nag-blocker.zip from the [latest release](https://github.com/JakeATX/docs-comment-warning-helper/releases/latest).
2. Unzip it in a permanent location.
3. Open chrome://extensions (or edge://extensions), enable **Developer mode**, and select **Load unpacked**.
4. Choose the unzipped extension folder and reload your Google Workspace tabs.

## What it matches

The extension looks for a popup or toast that contains both a comment/reply term and a rate/frequency phrase. Other errors remain visible. When it hides a match, a small notice appears briefly with a reminder to verify the comment.

If Google's wording changes, edit RATE_PATTERNS in content.js, then click the extension's reload button in chrome://extensions. Set DEBUG = true in that file to log matches in the DevTools console.

## Privacy

The extension runs only on Google Docs, Slides, and Sheets pages. It has no background service, analytics, or network requests, and requests no special permissions.

## Contributing

Bug reports and pull requests are welcome. Please include the browser, the Google Workspace app, and (if possible) the exact warning wording. Don't include document contents or private information.

## License

MIT. See [LICENSE](LICENSE).
