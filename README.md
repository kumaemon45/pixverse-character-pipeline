# PixVerse Character Pipeline

[English README](./README.en.md)

YAML 設定で多言語キャラクター動画を生成し、PixVerse と Remotion で最終 MP4 まで書き出すテンプレートです。

## できること

- キャラ画像を起点に、実写感のある背景込みの話すキャラクター動画を生成
- `project.yaml` から多言語・複数アスペクト比の案件を一括処理
- `generated | video | image` の clip を混在
- PixVerse 生成結果から `manifest.render.json` と最終 `character.mp4` を作成
- 旧 `spokesperson.yaml` を互換入力として受理

## セットアップ

```bash
cd remotion
pnpm install
```

PixVerse を使う場合は `pixverse` を PATH 上に置くか、`PIXVERSE_BIN=/path/to/pixverse` を設定します。
パイプライン実行の正式な入口は `./bin/pipeline` です。シェルの Node / PATH 解決が不安定な場合もこちらを優先してください。

## 主なコマンド

```bash
cd remotion

./bin/pipeline validate --config ../fixtures/generated/project.yaml
./bin/pipeline plan --config ../fixtures/generated/project.yaml
./bin/pipeline run --config ../fixtures/generated/project.yaml --dry-run
./bin/pipeline render --config ../fixtures/basic/project.yaml --lang en --ratio 16:9
```

- `pipeline:validate`: config 正規化と検証
- `pipeline:plan`: job 数と variant 数の確認
- `pipeline:run`: PixVerse 生成 + render manifest 作成 + Remotion 書き出し
- `pipeline:render`: ローカル `video` / `image` clip だけで単体レンダリング

`pnpm pipeline:*` も補助エイリアスとして残していますが、shell 側の Node / PATH が健全な場合のみ利用を推奨します。

## `project.yaml` の形

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

PixVerse 側ではこの `prompt.base` / `prompt.perRatio` を使って、キャラ画像から背景込みのシーンを生成します。実写背景の雰囲気は prompt で調整します。

## 出力

`pipeline:run` は次の構成で出力します。

```text
output/<project-slug>/<run-id>/
  manifest.json
  <lang>/<ratio>/
    manifest.render.json
    character.mp4
    assets/*
```

Remotion 用の staging は `remotion/public/.pipeline/` に自動生成されます。

## Fixtures / Tests

- `fixtures/basic/project.yaml`: ローカル `video` + `image` の render smoke 用
- `fixtures/generated/project.yaml`: generated / video / image 混在の plan / dry-run 用
- `fixtures/legacy/spokesperson.yaml`: 旧フォーマット互換テスト用

```bash
cd remotion
pnpm typecheck
pnpm test
```
