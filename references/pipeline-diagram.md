# Pipeline Diagram

## Flow Overview

```mermaid
flowchart TD
    Start([Start]) --> InputCheck{"project.yaml or spokesperson.yaml?"}
    InputCheck --> Normalize[Load + normalize config]
    Normalize --> Validate[Validate files and schema]
    Validate --> Plan[Compute variants and job counts]
    Plan --> Credit{"generated clips exist?"}
    Credit -->|No| Stage[Stage local assets]
    Credit -->|Yes| CreditCheck[PixVerse credit check]
    CreditCheck --> Base[Create base videos per aspect ratio]
    Base --> Speech[Create speech jobs per generated clip]
    Speech --> Post{Ambient sound / upscale?}
    Post -->|Ambient sound| Sound[Create sound jobs]
    Post -->|Upscale only| Upscale[Create upscale jobs]
    Sound --> Upscale
    Upscale --> Download[Download generated clip assets]
    Download --> Stage
    Stage --> RenderManifest[Write manifest.render.json per variant]
    RenderManifest --> Render[Render final MP4 with Remotion]
    Render --> RunManifest[Write run manifest.json]
    RunManifest --> Done([Done])
```

## Job Count Formula

```text
base_jobs   = number of requested aspect ratios if any generated clip exists else 0
speech_jobs = generated_clips x aspect_ratios
sound_jobs  = speech_jobs if ambientSound else 0
upscale_jobs = speech_jobs if upscale else 0
total_jobs  = base_jobs + speech_jobs + sound_jobs + upscale_jobs
```
