# Character Brief Template

## Primary YAML Schema

```yaml
project:
  slug: <string>
  title: <string>
  date: <YYYY-MM-DD>

speaker:
  name: <string>
  images:
    - <path>
  mode: <"single"|"reference">

locales:
  <lang>:
    theme:
      background: <string>
      accent: <string>
      text: <string>
    bgm: <path|null>
    bgmVolume: <number>
    clips:
      - id: <string>
        source: <"generated"|"video"|"image">
        durationSeconds: <number>
        text: <string>         # generated only
        audioFile: <path|null> # generated only
        ttsSpeaker: <number>   # generated only
        asset: <path>          # video/image only
        overlayText: <string>
        overlayStyle: <"title"|"subtitle"|"lower-third"|"endcard"|"none">
        hasAudio: <bool>

render:
  aspectRatios:
    - <"16:9"|"9:16"|"1:1"|"4:3"|"3:4"|"3:2"|"2:3">
  fps: <number>
  outputDir: <path>

generation:
  model: <string>
  quality: <string>
  upscale: <bool>
  ambientSound: <string|null>
  prompt:
    base: <string>
    perRatio:
      <ratio>: <string>
```

## Minimal Example

```yaml
project:
  slug: weekly-update
  title: Weekly Update
  date: "2026-03-21"

speaker:
  name: Neutral Guide
  images:
    - ./assets/speaker.png

locales:
  en:
    clips:
      - id: intro
        source: generated
        text: Hello everyone, here is this week's update.
        durationSeconds: 5

render:
  aspectRatios: ["16:9"]

generation:
  prompt:
    base: A friendly talking character speaking to camera, natural head movements, clean background
```

## Legacy Compatibility

`spokesperson.yaml` is still accepted and normalized automatically:

- `announcement.topic` -> `project.title`
- `scripts.<lang>` -> first `generated` clip
- `output.dest` -> `render.outputDir`
- `prompt.base` -> `generation.prompt.base`
