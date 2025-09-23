#!/bin/sh
set -e

VITE_API_URL=${VITE_API_URL:-"http://localhost:8000/api"}
VITE_RAZZER_URL=${VITE_RAZZER_URL:-"http://localhost:8000/razzer"}

cat <<EOF > /usr/share/nginx/html/config.js
window.config = {
  VITE_API_URL: "${VITE_API_URL}",
  VITE_RAZZER_URL: "${VITE_RAZZER_URL}"
};
EOF

# Pass control to CMD (nginx)
exec "$@"
