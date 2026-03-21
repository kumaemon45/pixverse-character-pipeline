# PixVerse Character Pipeline

[日本語 README](./README.md)

This repository is a template for generating multilingual character videos from YAML configuration, using PixVerse for generation and Remotion for final MP4 rendering.

## What It Does

- Turn a character image into a talking character video placed in a photoreal, live-action-style environment
- Batch-process projects from `project.yaml` across multiple locales and aspect ratios
- Mix `generated | video | image` clips in the same timeline
- Turn PixVerse outputs into `manifest.render.json` files and final `character.mp4` renders
- Accept legacy `spokesperson.yaml` as a backward-compatible input format

## Setup

```bash
cd remotion
pnpm install
```

To use PixVerse, make sure `pixverse` is available on your PATH, or set `PIXVERSE_BIN=/path/to/pixverse`.
The primary runtime entrypoint is `./bin/pipeline`. Prefer it when your shell resolves an unexpected Node or PATH.

## Main Commands

```bash
cd remotion

./bin/pipeline validate --config ../fixtures/generated/project.yaml
./bin/pipeline plan --config ../fixtures/generated/project.yaml
./bin/pipeline run --config ../fixtures/generated/project.yaml --dry-run
./bin/pipeline render --config ../fixtures/basic/project.yaml --lang en --ratio 16:9
```

- `pipeline:validate`: normalize and validate config input
- `pipeline:plan`: inspect variant counts and job counts
- `pipeline:run`: run PixVerse generation, build render manifests, and render final MP4s
- `pipeline:render`: render a single variant using only local `video` / `image` clips

`pnpm pipeline:*` still exists as a convenience alias, but it is only recommended when your shell Node / PATH setup is already healthy.

## `project.yaml` Shape

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

PixVerse uses `prompt.base` / `prompt.perRatio` to turn the input character image into a generated scene. The live-action background look is prompt-driven and can be tuned per project or per aspect ratio.

## Output Layout

`pipeline:run` writes outputs like this:

```text
output/<project-slug>/<run-id>/
  manifest.json
  <lang>/<ratio>/
    manifest.render.json
    character.mp4
    assets/*
```

Remotion staging assets are generated automatically under `remotion/public/.pipeline/`.

## Fixtures / Tests

- `fixtures/basic/project.yaml`: local `video` + `image` render smoke test
- `fixtures/generated/project.yaml`: mixed generated / video / image plan and dry-run fixture
- `fixtures/legacy/spokesperson.yaml`: legacy-format compatibility fixture

```bash
cd remotion
pnpm typecheck
pnpm test
```
