# Character Motion Prompt Library

Use these prompts in `generation.prompt.base` or `generation.prompt.perRatio`.

## Base Template

```text
A talking character derived from the provided character image, speaking directly to camera, [expression], [movement_style], [lighting], [background], [framing], [quality]
```

## News Anchor

**16:9**
```text
A professional news anchor derived from the provided character image, speaking directly to camera, composed expression, subtle head movements, studio lighting, photoreal newsroom background, medium shot, broadcast quality
```

**9:16**
```text
A professional news anchor derived from the provided character image, in vertical portrait frame, speaking to camera, composed expression, subtle head movements, studio lighting, photoreal newsroom background, upper body close-up
```

## Casual Presenter

**16:9**
```text
A friendly presenter derived from the provided character image, speaking to camera with warm smile, natural gestures, soft natural lighting, photoreal lifestyle background, medium shot, approachable and polished
```

**9:16**
```text
A friendly presenter derived from the provided character image, in vertical portrait frame, speaking to camera with warm smile, natural gestures, soft lighting, photoreal lifestyle background, upper body close-up
```

## Corporate Host

**16:9**
```text
A professional business host derived from the provided character image, speaking to camera, confident expression, measured gestures, even lighting, photoreal corporate office background, medium shot, trustworthy presentation
```

**9:16**
```text
A professional business host derived from the provided character image, in vertical portrait frame, speaking to camera, confident expression, even lighting, photoreal corporate office background, upper body close-up
```

## Notes

- Keep prompts simple; 1-2 sentences is enough.
- Do not describe lip sync. `create speech` handles speech animation separately.
- If ratios need different framing, set `generation.prompt.perRatio`.
- If the selling point is "character image into realistic background", make the background explicit: `photoreal office`, `live-action studio`, `real-world city street`, etc.
