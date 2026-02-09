import os, json, subprocess, datetime
from pathlib import Path
from openai import OpenAI

ROOT = Path(__file__).resolve().parents[2]

def sh(cmd: list[str]):
    subprocess.check_call(cmd, cwd=ROOT)

def git(*args: str):
    sh(["git", *args])

def write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")

def main():
    api_key = os.environ["OPENAI_API_KEY"]
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    client = OpenAI(api_key=api_key)

    # 1) Ask AI for a new tool spec (simple JSON)
    instructions = (
        "Propose ONE new in-browser developer utility tool.\n"
        "Constraints:\n"
        "- Must be fully client-side (no network calls).\n"
        "- Must not facilitate abuse.\n"
        "- Provide: slug, title, description, inputs, outputs, edge_cases.\n"
        "Return JSON only."
    )
    resp = client.responses.create(
        model=model,
        instructions=instructions,
        input="Choose something useful not already in the repo. Avoid JWT signing, credential cracking, anything abusive.",
        text={"format": {"type": "json_object"}},
        temperature=0.2,
    )
    spec = json.loads(resp.output_text)

    slug = spec["slug"]
    title = spec["title"]

    branch = f"ai/{slug}-{datetime.date.today().isoformat()}"
    git("checkout", "-b", branch)

    # 2) Generate TS tool module + Astro page
    tool_ts = f"""// Auto-generated tool: {title}
export function run(input: string): string {{
  // TODO: implement deterministically
  return input;
}}
"""
    page = f"""---
import ToolLayout from "../../components/ToolLayout.astro";
const title = {json.dumps(title)};
const description = {json.dumps(spec["description"])};
---

<ToolLayout title={{title}} description={{description}}>
  <p>Tool UI placeholder. Wire this to the tool module.</p>
</ToolLayout>
"""

    write(ROOT / f"src/pages/tools/{slug}.astro", page)
    write(ROOT / f"src/tools/{slug}.ts", tool_ts)

    # 3) Update index list (basic approach)
    index_path = ROOT / "src/pages/index.astro"
    idx = index_path.read_text(encoding="utf-8")
    if f'"/tools/{slug}"' not in idx:
        idx += f'\n<!-- AI add -->\n<a href="/tools/{slug}">{title}</a><br/>\n'
        index_path.write_text(idx, encoding="utf-8")

    # 4) Build check locally in action
    sh(["npm", "ci"])
    sh(["npm", "run", "build"])

    git("add", ".")
    git("commit", "-m", f"Add tool: {title}")
    git("push", "-u", "origin", branch)

    # 5) Open PR via GitHub CLI
    sh([
        "gh", "pr", "create",
        "--title", f"Add tool: {title}",
        "--body", "AI-generated tool + page. Please review safety + UX before merging.",
        "--base", "main",
    ])

if __name__ == "__main__":
    main()

