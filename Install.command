#!/bin/bash
set -euo pipefail

REPO="JakeATX/docs-comment-warning-helper"
DEST="$HOME/Library/Application Support/Docs Comment Warning Helper"
ARCHIVE="$DEST/extension.zip"
EXTENSION_DIR="$DEST/docs-comment-warning-helper"

mkdir -p "$DEST"
/usr/bin/curl --fail --location --silent --show-error   "https://github.com/${REPO}/releases/latest/download/comment-nag-blocker.zip"   --output "$ARCHIVE"
/usr/bin/ditto -x -k "$ARCHIVE" "$DEST"

if [[ ! -f "$EXTENSION_DIR/manifest.json" ]]; then
  echo "The release did not contain the expected extension folder:"
  echo "$EXTENSION_DIR"
  read -r -p "Press Return to close. " _
  exit 1
fi

/usr/bin/open -a "Google Chrome" "chrome://extensions"
/usr/bin/open "$DEST"
cat <<'MESSAGE'

Docs Comment Warning Helper is ready to load.

In Chrome:
  1. Turn on Developer mode.
  2. Click Load unpacked.
  3. Select the docs-comment-warning-helper folder in the Finder window.

The warning is hidden only in your browser. A hidden warning may mean a
comment was rejected; check the comment sidebar and repost anything missing.

MESSAGE
read -r -p "Press Return to close. " _
