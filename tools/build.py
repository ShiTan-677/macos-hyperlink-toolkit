#!/usr/bin/env python3
"""Build self-contained Automator Quick Actions. Python is a build-time tool only."""
import hashlib
import plistlib
import re
import uuid
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOOLS = {
    "copy-rich-link": "HLT - Copy Rich Link",
    "copy-excel-hyperlink": "HLT - Copy Excel Hyperlink",
    "paste-excel-formula": "HLT - Paste Excel Formula",
}


def stable_id(name):
    return str(uuid.uuid5(uuid.NAMESPACE_URL, "macos-hyperlink-toolkit/" + name)).upper()


def workflow(name, source):
    accepts = {"Container": "List", "Optional": True, "Types": ["com.apple.applescript.object"]}
    action_path = "/System/Library/Automator/Run JavaScript.action"
    return {
        "AMDocumentVersion": "2",
        "actions": [{"action": {
            "ActionBundlePath": action_path,
            "ActionName": "Run JavaScript",
            "ActionParameters": {"source": source},
            "AMAccepts": accepts,
            "AMProvides": {"Container": "List", "Types": ["com.apple.applescript.object"]},
            "AMActionVersion": "1.0",
            "AMApplication": ["Automator"],
            "AMParameterProperties": {"source": {}},
            "BundleIdentifier": "com.apple.Automator.RunJavaScript",
            "CanShowSelectedItemsWhenRun": False,
            "CanShowWhenRun": True,
            "Category": ["AMCategoryUtilities"],
            "CFBundleVersion": "1.0",
            "Class Name": "RunJavaScriptAction",
            "InputUUID": stable_id(name + "/input"),
            "OutputUUID": stable_id(name + "/output"),
            "UUID": stable_id(name + "/action"),
            "isViewVisible": 1,
            "nibPath": action_path + "/Contents/Resources/Base.lproj/main.nib",
        }, "isViewVisible": 1}],
        "connectors": {},
        "workflowMetaData": {
            "applicationBundleIDsByPath": {}, "applicationPaths": [],
            "inputTypeIdentifier": "com.apple.Automator.nothing",
            "outputTypeIdentifier": "com.apple.Automator.nothing",
            "presentationMode": 11, "processesInput": False,
            "serviceInputTypeIdentifier": "com.apple.Automator.nothing",
            "serviceOutputTypeIdentifier": "com.apple.Automator.nothing",
            "serviceProcessesInput": False, "systemImageName": "NSActionTemplate",
            "useAutomaticInputType": False,
            "workflowTypeIdentifier": "com.apple.Automator.servicesMenu",
        },
    }


def build():
    version = (ROOT / "VERSION").read_text().strip()
    if not re.fullmatch(r"\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?", version):
        raise ValueError("Invalid VERSION")
    release_name = "macos-hyperlink-toolkit-" + version
    target = ROOT / "dist" / release_name
    files = {}
    common = (ROOT / "src/common.js").read_text()
    for slug, name in TOOLS.items():
        source = common + "\n" + (ROOT / "src" / (slug + ".js")).read_text()
        files["scripts/" + slug + ".js"] = source.encode()
        contents = "workflows/" + name + ".workflow/Contents/"
        files[contents + "document.wflow"] = plistlib.dumps(workflow(name, source))
        files[contents + "Info.plist"] = plistlib.dumps({"NSServices": [{
            "NSMenuItem": {"default": name},
            "NSMessage": "runWorkflowAsService",
            "NSIconName": "NSActionTemplate", "NSBackgroundColorName": "background",
        }]})
    for name in ("LICENSE", "VERSION"):
        files[name] = (ROOT / name).read_bytes()
    files["START-HERE.md"] = (ROOT / "docs/START-HERE.md").read_bytes()
    for name, data in files.items():
        path = target / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
    # Fixed order and timestamps make the archive reproducible for the same source.
    archive = ROOT / "dist" / (release_name + ".zip")
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as package:
        for name, data in sorted(files.items()):
            item = zipfile.ZipInfo(release_name + "/" + name, date_time=(2026, 1, 1, 0, 0, 0))
            item.create_system = 3
            item.external_attr = 0o100644 << 16
            item.compress_type = zipfile.ZIP_DEFLATED
            package.writestr(item, data)
    checksum = hashlib.sha256(archive.read_bytes()).hexdigest()
    (ROOT / "dist/SHA256SUMS.txt").write_text(checksum + "  " + archive.name + "\n")
    print(archive)


if __name__ == "__main__":
    build()
