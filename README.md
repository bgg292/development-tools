# 🤖 AI-Run Developer Utilities (Experimental)

> **Important:** This repository is an **AI-run experiment** to explore the capabilities and limits of AI-assisted software development in a **secure, controlled way**.  
> The goal is to test how far automation can go **without compromising security, privacy, or human oversight**.

This project builds and maintains a privacy-first, in-browser developer utilities site that is publicly hosted at:

> 🌐 https://bgg292.github.io/development-tools/

The system uses:
- A static site (Astro) hosted on GitHub Pages (free)
- GitHub Actions for CI and deployment
- A scheduled AI workflow that proposes new tools via Pull Requests
- **Human approval gates** before anything is merged or deployed

All tools run entirely in the browser. No backend, no tracking, no uploads by default.

---

## 🧠 What this is

- A **research + engineering experiment** in:
  - AI-assisted code generation
  - AI-assisted content generation
  - Automated, repeatable, low-risk software production
- A **factory-style system**:
  - The platform is built once
  - AI proposes incremental improvements (new tools, fixes, copy)
  - Humans review and approve changes
- A **static, client-side-only tool suite**:
  - No backend
  - No user accounts
  - No data collection by default
  - No tracking or analytics unless explicitly added later

---

## 🛡️ Security & safety principles

This repo is intentionally designed with **defense in depth**:

1. **Human-in-the-loop**
   - AI never deploys directly to production.
   - All changes go through Pull Requests.
   - At least one human review is required before merge.

2. **Guardrails in CI**
   - A guard workflow blocks PRs that modify:
     - `.github/workflows/**`
     - `tools/agent/**`
     - other protected paths
   - CI must pass before merge.

3. **Least-privilege workflows**
   - The AI workflow can only:
     - create branches
     - open Pull Requests
   - It cannot deploy, mint tokens, or change permissions.

4. **Protected deployments**
   - Production deploys use a GitHub **Environment** with required reviewers.
   - Even after merge, a human must approve the deployment step.

5. **Secrets handling**
   - Secrets (e.g., `OPENAI_API_KEY`) exist only in GitHub Actions.
   - They are never committed to the repository.
   - The site itself is static and does not have access to secrets.

---

## 🔒 Privacy-first by design

- All tools run **fully in the browser**.
- No server-side processing of user input.
- No tracking pixels, no cookies, no fingerprinting by default.
- Every tool page shows a safety notice:
  > “Runs locally in your browser. Do not paste secrets.”

---

## 🏗️ How the automation works

1. On a schedule (e.g., monthly), a GitHub Action runs the AI agent.
2. The agent:
   - Proposes one new tool
   - Generates code, page, and copy
   - Runs the build
   - Opens a Pull Request
3. CI + Guard workflows run:
   - If they fail, the PR cannot be merged.
4. A human reviews:
   - Safety
   - Correctness
   - UX
   - Compliance with guardrails
5. If approved and merged:
   - A separate deploy workflow builds the site
   - Deployment requires **manual environment approval**

---

## 💸 Budget & infrastructure

- Hosting: GitHub Pages (free)
- CI/CD: GitHub Actions (free tier)
- Backend: none
- Ongoing infra cost: **~$0**
- Main variable cost: **AI API usage** in the scheduled workflow

---

## ⚠️ What this is NOT

- Not an autonomous system that publishes without oversight
- Not a promise of correctness or security guarantees
- Not a data collection platform
- Not a SaaS or backend service
- Not a “set and forget” money machine

This is an **experiment in responsible AI-assisted development**.

---

## 🧪 Research intent

This repository exists to answer questions like:
- How far can AI go in maintaining a real codebase?
- What guardrails are necessary for safe automation?
- Where does human judgment remain essential?
- What kinds of products are suitable for AI-first production?

---

## 🆘 If you find an issue

- Please open a GitHub Issue.
- If it’s security-related, describe the problem and avoid sharing sensitive details publicly.

---

## 📜 License & responsibility

- All code and tools are provided “as is”.
- You are responsible for reviewing changes before deployment.
- You are responsible for compliance with any platform policies or laws relevant to your use.

---

**In short:**  
This is intended to be a **secure, human-supervised AI development experiment** that happens to produce useful, privacy-first developer tools along the way.
