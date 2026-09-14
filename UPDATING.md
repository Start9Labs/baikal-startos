# Updating the upstream version

Baïkal is built from its official release ZIP because that artifact includes the Composer dependencies omitted from GitHub's generated source archives. The PHP Apache base image is pinned separately by tag and multi-architecture digest.

## Determining the upstream version

### Baïkal

Fetch the latest stable release and its archive digest:

```sh
gh api repos/sabre-io/Baikal/releases/latest --jq '{tag: .tag_name, asset: (.assets[] | select(.name | endswith(".zip")) | {name, digest, url: .browser_download_url})}'
```

`Dockerfile` records the release in `BAIKAL_VERSION` and the archive checksum in `BAIKAL_SHA256`.

### PHP Apache image

Inspect the exact PHP Apache tag and confirm that its index contains both `linux/amd64` and `linux/arm64` images:

```sh
bash <<'EOF'
set -euo pipefail
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
FROM=$(awk '$1 == "FROM" && $2 ~ /^php:/ {print $2}' Dockerfile)
IMAGE=${FROM%@*}
PHP_TAG=${IMAGE#php:}
PINNED_DIGEST=${FROM#*@}
curl -fsSL -o "$TMP/token.json" \
  'https://auth.docker.io/token?service=registry.docker.io&scope=repository:library/php:pull'
TOKEN=$(jq -er .token "$TMP/token.json")
curl -fsSL -D "$TMP/headers" -o "$TMP/manifest.json" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Accept: application/vnd.oci.image.index.v1+json' \
  "https://registry-1.docker.io/v2/library/php/manifests/$PHP_TAG"
DIGEST=$(awk 'tolower($1) == "docker-content-digest:" {gsub("\\r", "", $2); print $2}' "$TMP/headers")
[[ $DIGEST =~ ^sha256:[[:xdigit:]]{64}$ ]] || {
  printf 'Invalid index digest: %s\n' "$DIGEST" >&2
  exit 1
}
printf 'Index digest: %s\n' "$DIGEST"
[[ $DIGEST == "$PINNED_DIGEST" ]] || {
  printf 'Dockerfile pins %s\n' "$PINNED_DIGEST" >&2
  exit 1
}
jq -er '
  [.manifests[]
    | select(.platform.os == "linux")
    | select(.platform.architecture == "amd64" or .platform.architecture == "arm64")]
  | if length == 2 and ([.[].platform.architecture] | unique | sort) == ["amd64", "arm64"]
    then .[] | "\(.platform.os)/\(.platform.architecture) \(.digest)"
    else error("The image index must contain one linux/amd64 and one linux/arm64 image")
    end
' "$TMP/manifest.json"
EOF
```

The `Dockerfile` `FROM` line pins both the exact PHP patch tag and the reported index digest.

## Applying the bump

1. Update `BAIKAL_VERSION` and `BAIKAL_SHA256` in `Dockerfile` from the official release asset.
2. Review the upstream release notes and upgrade guide for PHP requirement, persistent-path, schema, and browser-upgrade changes.
3. If updating PHP, change the exact tag and matching multi-architecture digest on the `FROM` line. Verify the required PHP modules remain present with `php -m`.
4. Update `startos/versions/current.ts` with the Baïkal version and localized release notes. Follow the packaging guide's migration rule; most bumps edit `current.ts` in place.
5. Run `npm ci` followed by `make`; the shared build target runs typechecking, linting, bundling, and package builds.
6. Run the image with a fresh data directory, complete browser setup using SQLite, create DAV data, restart it, and verify the data persists.
7. Verify a stopped-service backup and restore before publishing any release that changes Baïkal's storage or upgrade behavior.
