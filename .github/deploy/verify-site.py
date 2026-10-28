#!/usr/bin/env python3
"""Check public HTTPS responses against the exact deployed archive."""

import hashlib
import json
import os
import sys
import tarfile
import time
from pathlib import Path
from urllib.error import URLError
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from urllib.request import Request, urlopen


def verify(archive_path: str) -> None:
    config = json.loads(Path(__file__).with_name("site.json").read_text())
    revision = os.environ.get("GITHUB_SHA", "health")
    with tarfile.open(archive_path, "r:gz") as archive:
        for check in config["health_checks"]:
            expected = None
            if "file" in check:
                stream = archive.extractfile(check["file"])
                if stream is None:
                    raise ValueError(f"Health-check file missing: {check['file']}")
                with stream:
                    expected = hashlib.sha256(stream.read()).digest()
            url = urlsplit(check["url"])
            if url.scheme != "https":
                raise ValueError("Production checks must use HTTPS")
            query = parse_qsl(url.query, keep_blank_values=True)
            query.append(("deployment", revision))
            target = urlunsplit(url._replace(query=urlencode(query)))
            for attempt in range(3):
                try:
                    request = Request(target, headers={"Cache-Control": "no-cache"})
                    with urlopen(request, timeout=30) as response:
                        if response.status != 200 or urlsplit(response.url).scheme != "https":
                            raise ValueError("Expected an HTTPS 200 response")
                        body = response.read(10 * 1024 * 1024 + 1)
                    if len(body) > 10 * 1024 * 1024:
                        raise ValueError("Unexpectedly large health response")
                    if expected is not None and hashlib.sha256(body).digest() != expected:
                        raise ValueError("Published bytes do not match this revision")
                    if "contains" in check and check["contains"].encode() not in body:
                        raise ValueError("Expected download directory listing is missing")
                    print(f"Verified {check['url']}")
                    break
                except (OSError, URLError, ValueError) as error:
                    if attempt == 2:
                        raise ValueError(f"Health check failed for {check['url']}: {error}") from error
                    time.sleep(3)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: verify-site.py ARCHIVE.tar.gz")
    try:
        verify(sys.argv[1])
    except (OSError, ValueError, tarfile.TarError) as error:
        raise SystemExit(str(error)) from error
