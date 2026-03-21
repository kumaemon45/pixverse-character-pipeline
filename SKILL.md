---
name: pixverse-character-pipeline
description: >
  Generate multilingual character videos from a neutral `project.yaml` or a legacy
  `spokesperson.yaml`. Supports PixVerse-generated clips plus local video/image clips,
  then renders final MP4s with Remotion. Especially useful for turning a character image
  into a talking character clip set inside a photoreal, live-action-style background. Use
  when the user says "character video", "talking character", "lip sync video",
  "キャラクター動画", "多言語アナウンス動画", or "multilingual video".
metadata:
  version: "2.1"
---

# PixVerse Character Pipeline

## Purpose

Turn a single YAML config into multilingual character videos, with PixVerse generating talking character scenes from character images and prompt-defined live-action-style backgrounds.

- Primary config: `project.yaml`
- Legacy compatible config: `spokesperson.yaml`
- Execution package: `remotion/`

## Core Commands

```bash
cd remotion

./bin/pipeline validate --config <path>
./bin/pipeline plan --config <path>
./bin/pipeline run --config <path> [--dry-run] [--run-id <id>]
./bin/pipeline render --config <path> --lang <lang> --ratio <ratio> [--run-id <id>]
```

`pnpm pipeline:*` remains available as a convenience alias, but `./bin/pipeline` is the primary stable entrypoint when shell Node / PATH resolution is unreliable.

## Runtime Rules

1. `pipeline:run` is the full path: config load -> PixVerse generation -> render manifests -> Remotion MP4.
2. `pipeline:render` is only for configs that use local `video` / `image` clips.
3. `pixverse` must be available on PATH, or `PIXVERSE_BIN` must point to the executable.
4. Every PixVerse call must include `--json`.
5. Base videos are generated once per aspect ratio, then reused across locales.
6. Output layout is `output/<project-slug>/<run-id>/<lang>/<ratio>/`.
7. Background style is prompt-driven; use `generation.prompt.base` / `perRatio` to push toward photoreal, live-action scenes.
8. If Node / PATH resolution is unstable in the shell, use `./bin/pipeline` rather than `pnpm pipeline:*`.

## Config Model

`project.yaml` is the neutral interface:

```yaml
project:
  slug: my-campaign
  title: Spring Campaign
  date: "2026-03-21"

speaker:
  name: Reporter Hana
  images:
    - ./assets/hana.png
  mode: single

locales:
  ja:
    theme:
      background: "#111111"
      accent: "#ff6b35"
      text: "#ffffff"
    clips:
      - id: intro
        source: generated
        text: 本日のお知らせです
        ttsSpeaker: 1
        durationSeconds: 5
        overlayText: 春のキャンペーン開始
        overlayStyle: title
      - id: endcard
        source: image
        asset: ./assets/endcard.png
        durationSeconds: 3
        overlayText: example.com
        overlayStyle: endcard

render:
  aspectRatios: ["16:9", "9:16"]
  fps: 30
  outputDir: ./output

generation:
  model: v5.6
  quality: 1080p
  upscale: true
  ambientSound: null
  prompt:
    base: A talking character derived from the provided character image, speaking directly to camera in a photoreal live-action environment with realistic depth and polished cinematic lighting
```

## Clip Semantics

- `source: generated`
  - requires `text` or `audioFile`
  - uses PixVerse `create speech`
- `source: video`
  - requires `asset`
  - uses the local file directly in Remotion
- `source: image`
  - requires `asset`
  - renders as a static end card or still visual

Optional fields:

- `overlayText`
- `overlayStyle`
- `ttsSpeaker`
- `hasAudio`

## Compatibility Rules

Legacy `spokesperson.yaml` is normalized like this:

- `announcement.topic/date` -> `project.title/date`
- `scripts.<lang>` -> `locales.<lang>.clips[0]`
- `output.*` -> `render.*` and `generation.*`
- `prompt.*` -> `generation.prompt.*`

## Validation Checklist

- `speaker.images` is 1-7 files
- `generated` clips have `text` or `audioFile`
- `video` / `image` clips have `asset`
- `render.aspectRatios` only uses supported ratios
- all local file references exist before execution

## Workflow Summary

1. Load and normalize config
2. Validate schema and file paths
3. Plan variants and job counts
4. Generate base videos per aspect ratio when any `generated` clip exists
5. Generate speech per `generated` clip
6. Optionally run sound and upscale
7. Download generated assets
8. Build `manifest.render.json` per variant
9. Render final `character.mp4` with Remotion
10. Write top-level `manifest.json`

## PixVerse Commands Used

| Command | Purpose |
|---------|---------|
| `pixverse account info --json` | Credit check |
| `pixverse create video --image` | Base video from one image |
| `pixverse create reference --images` | Base video from multiple images |
| `pixverse create speech --tts-text` | TTS lip sync |
| `pixverse create speech --audio` | Audio-file lip sync |
| `pixverse create sound --prompt` | Optional ambient sound |
| `pixverse create upscale --quality` | Optional final upscale |
| `pixverse task wait <id> --json` | Wait for async jobs |
| `pixverse asset download <id> --dest <dir> --json` | Download generated video |

## Output

```text
output/<project-slug>/<run-id>/
  manifest.json
  <lang>/<ratio>/
    manifest.render.json
    character.mp4
    assets/*
```

Remotion staging assets are copied into `remotion/public/.pipeline/` during execution.

## Reference Files

- `README.md`
- `references/character-brief-template.md`
- `references/interactive-questions.md`
- `references/prompt-library.md`
- `references/pipeline-diagram.md`
- `references/manifest-schema.md`
