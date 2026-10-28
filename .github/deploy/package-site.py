#!/usr/bin/env python3
"""Archive only the public site; never transfer the checkout or installers."""

import json
import stat
import sys
import tarfile
from pathlib import Path

CONFIG = Path(__file__).with_name("site.json")
INTERNAL_NAMES = {
    "AGENTS.md", "CLAUDE.md", "README.md", "deploy.sh", "package.json",
    "package-lock.json", "tsconfig.json", "astro.config.mjs",
}
PRIVATE_SUFFIXES = {
    ".pem", ".key", ".p12", ".pfx", ".astro", ".ts", ".tsx", ".jsx",
    ".msi", ".dmg", ".tar", ".gz", ".zip", ".bak", ".sql",
}
PROTECTED_ROOTS = {"downloads", "nawaMessenger", "downloads_backup"}
MAX_BYTES = 200 * 1024 * 1024


def public_file(path: Path, source: Path) -> bool:
    relative = path.relative_to(source)
    # In particular, Astro copies public/gallery/.gitkeep into its output.
    if any(part.startswith(".") for part in relative.parts):
        return False
    if relative.parts[0] in PROTECTED_ROOTS:
        raise ValueError(f"Installer directory cannot be deployed: {relative}")
    if path.is_symlink():
        raise ValueError(f"Symlink cannot be deployed: {relative}")
    if path.is_dir():
        return False
    if not stat.S_ISREG(path.stat().st_mode):
        raise ValueError(f"Not a regular public file: {relative}")
    if path.name in INTERNAL_NAMES or path.suffix.lower() in PRIVATE_SUFFIXES:
        raise ValueError(f"Internal or private file in public output: {relative}")
    return True


def package(destination: Path) -> None:
    config = json.loads(CONFIG.read_text())
    checkout = Path.cwd().resolve()
    if config["mode"] == "astro":
        source = checkout / "dist"
        if not source.is_dir() or source.is_symlink():
            raise ValueError("Build output dist/ must be a real directory")
        candidates = list(source.rglob("*"))
    elif config["mode"] == "static":
        source = checkout
        # Root HTML and explicit public directories are the complete allowlist.
        candidates = list(source.glob("*.html"))
        candidates += list(source.glob("sitemap*.xml"))
        if (source / "robots.txt").exists():
            candidates.append(source / "robots.txt")
        for directory in config["public_directories"]:
            folder = source / directory
            if folder.is_symlink():
                raise ValueError(f"Public directory must not be a symlink: {directory}")
            if folder.is_dir():
                candidates += list(folder.rglob("*"))
    else:
        raise ValueError("Unknown site packaging mode")

    files = sorted({p for p in candidates if public_file(p, source)})
    names = {p.relative_to(source).as_posix() for p in files}
    required = set(config["required_files"])
    required.update(c["file"] for c in config["health_checks"] if "file" in c)
    if not required.issubset(names):
        raise ValueError(f"Public files missing: {', '.join(sorted(required - names))}")
    size = sum(p.stat().st_size for p in files)
    if not files or size > MAX_BYTES:
        raise ValueError("Empty or unexpectedly large website payload")
    destination = destination.resolve()
    if destination.is_relative_to(source):
        raise ValueError("Write deployment archives outside the public source directory")
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tarfile.open(destination, "w:gz", format=tarfile.USTAR_FORMAT) as archive:
        for path in files:
            info = tarfile.TarInfo(path.relative_to(source).as_posix())
            info.size = path.stat().st_size
            info.mode = 0o644
            with path.open("rb") as content:
                archive.addfile(info, content)
    print(f"Packaged {len(files)} public files ({size:,} uncompressed bytes).")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: package-site.py OUTPUT.tar.gz")
    try:
        package(Path(sys.argv[1]))
    except (OSError, ValueError, tarfile.TarError) as error:
        raise SystemExit(str(error)) from error
