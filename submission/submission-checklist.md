# Submission Checklist

Use one of these two submission paths:

- `GitHub link + email`
- `zip file + email`

## Recommended: GitHub Link + Email

Send:

- email to `naomi@pixverse.ai`
- subject: `[CLI Feedback/Skill Submission] Takamasa - PixVerse Character Pipeline`
- repo link
- 1 sample MP4 if available
- 1 terminal screenshot of `pipeline:plan` or `pipeline:run --dry-run`

Checklist:

- README is clear in both Japanese and English
- `SKILL.md` matches the current implementation
- `submission/email-template.txt` has the real repo link filled in
- one short generated output is attached or linked
- no private assets, secrets, or local absolute paths are included

## Alternative: zip File + Email

Use this if you do not want to publish the repo yet.

Include in the zip:

- `README.md`
- `README.en.md`
- `SKILL.md`
- `remotion/`
- `fixtures/`
- `references/`
- `submission/pixverse-cli-skill-submission.md`

Do not include:

- `remotion/node_modules/`
- `output/`
- `remotion/public/.pipeline/`
- `.env` files
- personal cache files such as `.DS_Store`

Suggested zip command:

```bash
cd /Users/takamasa/Projects/Pixverse-Workflow
zip -r pixverse-character-pipeline-submission.zip pixverse-character-pipeline \
  -x "pixverse-character-pipeline/remotion/node_modules/*" \
  -x "pixverse-character-pipeline/output/*" \
  -x "pixverse-character-pipeline/remotion/public/.pipeline/*" \
  -x "pixverse-character-pipeline/.DS_Store" \
  -x "pixverse-character-pipeline/**/.DS_Store"
```

## What Strengthens the Submission

- one real PixVerse-generated sample, not only local smoke render
- one sentence explaining why this is useful for OpenClaw / AI agent workflows
- clear command surface: `validate`, `plan`, `run`, `render`
- explicit PixVerse CLI coverage list

## Honest Positioning

Current strongest claim:

- implemented and locally validated workflow
- dry-run and local render paths verified
- PixVerse generation path implemented in code

Best additional proof before sending:

- produce one actual generated sample with PixVerse and attach it
