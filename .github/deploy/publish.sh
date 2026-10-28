#!/usr/bin/env bash
# The server's forced-command receiver restricts this key to one site's deploys.
set -euo pipefail

archive=${1:?Usage: publish.sh /path/to/site.tar.gz}
: "${RUNNER_TEMP:?Runner temporary directory is required}"
: "${DEPLOY_HOST:?Set repository variable DEPLOY_HOST}"
: "${DEPLOY_USER:?Set repository variable DEPLOY_USER}"
: "${DEPLOY_SSH_KEY:?Set repository secret DEPLOY_SSH_KEY}"
: "${DEPLOY_KNOWN_HOSTS:?Set repository secret DEPLOY_KNOWN_HOSTS}"
: "${GITHUB_SHA:?GitHub revision is required}"

[[ "$GITHUB_SHA" =~ ^[0-9a-f]{40}$ ]] || { echo 'Invalid revision.' >&2; exit 1; }
[[ "$DEPLOY_HOST" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ]] || { echo 'Invalid deployment host.' >&2; exit 1; }
[[ "$DEPLOY_USER" =~ ^[a-z_][a-z0-9_-]*$ && "$DEPLOY_USER" != root ]] || { echo 'A dedicated deployment user is required.' >&2; exit 1; }
[[ -f "$archive" && -s "$archive" ]] || { echo 'Website archive is missing.' >&2; exit 1; }

umask 077
ssh_directory=$(mktemp -d "$RUNNER_TEMP/site-deploy-XXXXXX")
trap 'rm -rf -- "$ssh_directory"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
printf '%s\n' "$DEPLOY_SSH_KEY" > "$ssh_directory/key"
printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > "$ssh_directory/known_hosts"
unset DEPLOY_SSH_KEY DEPLOY_KNOWN_HOSTS
ssh-keygen -y -P '' -f "$ssh_directory/key" > /dev/null
ssh-keygen -F "$DEPLOY_HOST" -f "$ssh_directory/known_hosts" > /dev/null

ssh -T \
  -i "$ssh_directory/key" \
  -o IdentitiesOnly=yes \
  -o BatchMode=yes \
  -o PasswordAuthentication=no \
  -o KbdInteractiveAuthentication=no \
  -o StrictHostKeyChecking=yes \
  -o UserKnownHostsFile="$ssh_directory/known_hosts" \
  -o GlobalKnownHostsFile=/dev/null \
  -o ConnectTimeout=20 \
  -o ServerAliveInterval=15 \
  -o ServerAliveCountMax=3 \
  "$DEPLOY_USER@$DEPLOY_HOST" "deploy $GITHUB_SHA" < "$archive"

python3 .github/deploy/verify-site.py "$archive"
if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  printf 'Production deployment `%s` passed the server and public HTTPS checks.\n' "$GITHUB_SHA" >> "$GITHUB_STEP_SUMMARY"
fi
