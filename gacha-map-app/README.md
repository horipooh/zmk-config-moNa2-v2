# ガチャガチャマップ

ガチャガチャの最新商品情報をSNS・公式サイトから自動収集し、設置店舗をGoogle Maps上でピン表示するスマホアプリ（PWA）。

## 機能

| 機能 | 説明 |
|------|------|
| 🗺️ マップ | Google Maps上に店舗ピンを表示（緑=48h以内更新、黄=1週間以内、灰=それ以降）|
| 🎰 商品検索 | メーカー・シリーズ・フリーワードで商品を絞り込み |
| 📋 店舗一覧 | 都道府県別の店舗一覧（オフラインでも閲覧可能）|
| 📣 新着フィード | 公式リリース情報 + SNS口コミの時系列表示 |
| 📍 現在地 | 現在地から近くのガチャ店舗を検索 |

## データソース

- **公式リリース情報**: バンダイ、タカラトミーアーツ、エポック のWebスクレイピング
- **SNS口コミ**: Twitter/X API v2 のリアルタイム検索（「ガチャガチャ 入荷」等のキーワード）
- **位置情報**: ツイート本文から店舗名・地名を抽出 → Google Geocoding API で座標変換

## ディレクトリ構成

```
gacha-map-app/
├── frontend/          React + TypeScript + Vite (PWA)
├── backend/           Express + TypeScript API
├── .env.example       必要な環境変数の説明
└── docker-compose.yml 本番環境構成
```

## セットアップ

### 1. 環境変数の設定

```bash
# バックエンド
cp .env.example backend/.env
# APIキーを設定（未設定でもモックデータで動作）

# フロントエンド
cp .env.example frontend/.env
# VITE_GOOGLE_MAPS_API_KEY を設定（未設定でもデモマップで動作）
```

### 2. バックエンド起動

```bash
cd backend
npm install
npm run dev
# → http://localhost:3001
```

### 3. フロントエンド起動

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## APIキーについて

| キー | 用途 | 無料枠 |
|------|------|--------|
| Google Maps JavaScript API | 地図表示 | $200/月相当 |
| Google Geocoding API | 住所→座標変換 | $200/月相当 |
| Twitter/X Bearer Token | SNS投稿取得 | 50万ツイート/月 |

**APIキーなしでも動作します**（モックデータを使用）。

## API エンドポイント

```
GET /api/products           商品一覧（?q=検索&manufacturer=BANDAI&series=...）
GET /api/products/:id       商品詳細
GET /api/products/releases  最新リリース情報
GET /api/stores             店舗一覧（?swLat=&swLng=&neLat=&neLng= or ?lat=&lng=&radiusKm=）
GET /api/stores/:id         店舗詳細
GET /api/stores/:id/feed    店舗のSNS口コミ
GET /api/sightings/recent   全体の新着口コミ
GET /api/health             ヘルスチェック
```

## ピンの色の意味

- 🟢 **緑**: 48時間以内に情報確認あり
- 🟡 **黄**: 1週間以内に情報確認あり
- ⚪ **灰**: 1週間以上前の情報
