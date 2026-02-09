import os, json, subprocess, datetime, re
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

def safe_slug(s: str) -> str:
    s = (s or "").strip().lower()
    s = re.sub(r"[^a-z0-9-]+", "-", s)
    s = re.sub(r"-{2,}", "-", s).strip("-")
    return s or "tool"

def get_json_spec(client: OpenAI, model: str) -> dict:
    instructions = (
        "Propose ONE new in-browser developer utility tool.\n"
        "Constraints:\n"
        "- Must be fully client-side (no network calls).\n"
        "- Must not facilitate abuse.\n"
        "- Must not require users to paste secrets; include warnings.\n"
        "- Provide JSON with: slug, title, description, placeholder_ui, behavior_notes.\n"
        "Return JSON only."
    )

    # IMPORTANT: The Responses API requires the *input* to contain the word 'json'
    user_input = (
        "Return a single JSON object only.\n"
        "Choose something useful not already in the repo. Avoid anything security-offensive.\n"
        "Keep it simple and deterministic."
    )

    resp = client.responses.create(
        model=model,
        instructions=instructions,
        input=user_input,
        text={"format": {"type": "json_object"}},
        temperature=0.2,
    )

    try:
        return json.loads(resp.output_text)
    except Exception:
        # One retry with an even stricter reminder
        resp2 = client.responses.create(
            model=model,
            instructions=instructions,
            input=user_input + "\n\nJSON ONLY. No prose, no markdown, no code fences.",
            text={"format": {"type": "json_object"}},
            temperature=0.2,
        )
        return json.loads(resp2.output_text)

def main():
    api_key = os.environ["OPENAI_API_KEY"]
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    client = OpenAI(api_key=api_key)

    spec = get_json_spec(client, model)

    slug = safe_slug(spec.get("slug", "")) or safe_slug(spec.get("title", "tool"))
    title = str(spec.get("title", slug))
    description = str(spec.get("description", "In-browser developer utility (privacy-first)."))

    # Prevent collisions
    tool_page = ROOT / f"src/pages/tools/{slug}.astro"
    if tool_page.exists():
        slug = f"{slug}-{datetime.date.today().isoformat()}"

    branch = f"ai/{slug}-{datetime.date.today().isoformat()}"
    git("checkout", "-b", branch)

    # Generate external JS (CSP-safe: no inline scripts)
    js_prompt = (
        "Write a small, plain JavaScript file that wires up the tool UI.\n"
        "Rules:\n"
        "- NO network calls (no fetch/XHR/websocket).\n"
        "- Pure client-side deterministic behavior.\n"
        "- Use DOMContentLoaded.\n"
        "- Expect these element ids: tool-in, tool-run, tool-copy, tool-out.\n"
        "- tool-in is a textarea; tool-out is a pre.\n"
        "- On click tool-run: transform input -> output.\n"
        "- Add copy button behavior.\n"
        f"Tool behavior notes: {spec.get('behavior_notes','')}\n"
        f"Tool placeholder UI: {spec.get('placeholder_ui','')}\n"
        "Output ONLY JavaScript, no code fences."
    )

    js_resp = client.responses.create(
        model=model,
        instructions="You write safe browser JS for simple developer utilities.",
        input=js_prompt,
        temperature=0.2,
    )
    js_code = (js_resp.output_text or "").replace("```", "").strip()

    page = f"""---
import ToolLayout from "../../components/ToolLayout.astro";

export const title = {json.dumps(title)};
export const description = {json.dumps(description)};

// BASE_URL-safe asset helper
const baseRaw = import.meta.env.BASE_URL;
const base = baseRaw.endsWith("/") ? baseRaw : `${{baseRaw}}/`;
const asset = (path) => `${{base}}${{String(path).replace(/^\\//, "")}}`;
---

<ToolLayout title={{title}} description={{description}}>
  <textarea id="tool-in" rows="10" style="width:100%;" placeholder="Paste input here…"></textarea>

  <div style="margin: 10px 0; display:flex; gap:10px; flex-wrap:wrap;">
    <button id="tool-run" type="button">Run</button>
    <button id="tool-copy" type="button" disabled>Copy output</button>
  </div>

  <pre id="tool-out" style="white-space:pre-wrap; padding:12px; border:1px solid #e5e7eb; border-radius:10px;"></pre>

  <script src={{asset("js/{slug}.js")}}></script>
</ToolLayout>
"""

    tool_ts = f"""// Auto-generated tool module placeholder: {title}
// You can later refactor the public/js/{slug}.js logic into reusable TS here.

export function run(input: string): string {{
  return input;
}}
"""

    write(ROOT / f"src/pages/tools/{slug}.astro", page)
    write(ROOT / f"public/js/{slug}.js", js_code)
    write(ROOT / f"src/tools/{slug}.ts", tool_ts)

    # Build check
    sh(["npm", "ci"])
    sh(["npm", "run", "build"])

    git("add", ".")
    git("commit", "-m", f"Add tool: {title}")
    git("push", "-u", "origin", branch)

    sh([
        "gh", "pr", "create",
        "--title", f"Add tool: {title}",
        "--body", "AI-generated tool (CSP-safe external JS). Please review safety/UX before merging.",
        "--base", "main",
    ])

if __name__ == "__main__":
    main()

