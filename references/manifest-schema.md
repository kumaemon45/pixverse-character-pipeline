# Manifest Schema

The pipeline writes two manifest types:

- `manifest.json`: run summary for the whole batch
- `manifest.render.json`: one render-ready manifest per `(language, aspect_ratio)`

## Run Manifest

```json
{
  "configPath": "/abs/path/to/project.yaml",
  "generatedAt": "2026-03-21T07:37:52.618Z",
  "project": {
    "slug": "mixed-generated",
    "title": "Mixed Generated Pipeline",
    "date": "2026-03-21"
  },
  "sourceFormat": "project",
  "summary": {
    "total": 4,
    "completed": 4,
    "failed": 0,
    "planned": 0,
    "skipped": 0
  },
  "variants": [
    {
      "language": "ja",
      "aspectRatio": "16:9",
      "status": "completed",
      "file": "ja/16x9/character.mp4",
      "renderManifest": "ja/16x9/manifest.render.json",
      "baseVideoId": "393098579578714",
      "clipAssets": {
        "opener": "ja/16x9/assets/opener.mp4",
        "showcase": "ja/16x9/assets/showcase.mp4",
        "endcard": "ja/16x9/assets/endcard.svg"
      },
      "clipVideoIds": {
        "opener": {
          "speech": "393098788981370",
          "sound": null,
          "upscale": "393099404148257",
          "final": "393099404148257"
        }
      },
      "error": null
    }
  ]
}
```

## Render Manifest

```json
{
  "projectSlug": "mixed-generated",
  "language": "ja",
  "aspectRatio": "16:9",
  "fps": 30,
  "width": 1920,
  "height": 1080,
  "durationInFrames": 165,
  "speakerImage": ".pipeline/mixed-generated/20260321T073752Z/ja/16x9/assets/speaker.svg",
  "bgm": null,
  "bgmVolume": 0.15,
  "theme": {
    "background": "#111827",
    "accent": "#f97316",
    "text": "#ffffff"
  },
  "cuts": [
    {
      "id": "opener",
      "startFrame": 0,
      "durationInFrames": 60,
      "videoSrc": ".pipeline/mixed-generated/20260321T073752Z/ja/16x9/assets/opener.mp4",
      "imageSrc": null,
      "overlayText": "Spring Launch",
      "overlayStyle": "title",
      "hasAudio": true
    }
  ]
}
```

## Notes

- `clipAssets` stores output-relative asset paths for auditing.
- `speakerImage`, `bgm`, `videoSrc`, `imageSrc` in `manifest.render.json` are public-relative paths used by Remotion.
- `planned` appears when `pipeline:run --dry-run` is used.
