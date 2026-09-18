import hashlib
import importlib.util
import plistlib
import tempfile
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("build", ROOT / "tools/build.py")
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


class PackageTest(unittest.TestCase):
    def test_standalone_sources_services_and_reproducible_archive(self):
        with tempfile.TemporaryDirectory() as temporary:
            stage = Path(temporary)
            for folder in ("src", "docs"):
                (stage / folder).mkdir()
            for file in [ROOT / "VERSION", ROOT / "LICENSE", ROOT / "docs/START-HERE.md", ROOT / "docs/START-HERE.html", *sorted((ROOT / "src").glob("*.js"))]:
                (stage / file.relative_to(ROOT)).write_bytes(file.read_bytes())
            original_root = builder.ROOT
            try:
                builder.ROOT = stage
                builder.build()
                archive = next((stage / "dist").glob("*.zip"))
                digest = hashlib.sha256(archive.read_bytes()).hexdigest()
                builder.build()
                self.assertEqual(hashlib.sha256(archive.read_bytes()).hexdigest(), digest)
                self.assertEqual((stage / "dist/SHA256SUMS.txt").read_text(), digest + "  " + archive.name + "\n")
                with zipfile.ZipFile(archive) as package:
                    prefix = archive.stem + "/"
                    self.assertEqual(len(package.namelist()), 13)
                    for name in ("START-HERE.md", "START-HERE.html"):
                        self.assertEqual(package.read(prefix + name), (stage / "docs" / name).read_bytes())
                    for slug, name in builder.TOOLS.items():
                        source = (stage / "src/common.js").read_text() + "\n" + (stage / "src" / (slug + ".js")).read_text()
                        standalone = package.read(prefix + "scripts/" + slug + ".js").decode()
                        document = plistlib.loads(package.read(prefix + "workflows/" + name + ".workflow/Contents/document.wflow"))
                        info = plistlib.loads(package.read(prefix + "workflows/" + name + ".workflow/Contents/Info.plist"))
                        self.assertEqual(standalone, source)
                        self.assertEqual(document["actions"][0]["action"]["ActionParameters"]["source"], source)
                        self.assertEqual(info["NSServices"][0]["NSMenuItem"]["default"], name)
                        self.assertEqual(document["workflowMetaData"]["serviceInputTypeIdentifier"], "com.apple.Automator.nothing")
                        self.assertNotIn("/Users/", package.read(prefix + "workflows/" + name + ".workflow/Contents/document.wflow").decode())
            finally:
                builder.ROOT = original_root


if __name__ == "__main__":
    unittest.main()
