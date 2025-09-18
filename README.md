# Simple Task Stack - タスク管理アプリケーション

シンプルで直感的なタスク管理Webアプリケーション。時間ベースのスケジューリングとバックログ管理機能を提供します。

## ✨ 主な機能

### 📅 今日のアジェンダ管理
- 時間指定でのタスクスケジューリング
- 推定作業時間の設定
- タスク完了チェック機能
- タスクの重複検知とアラート表示

### 📋 バックログ管理
- 未スケジュールタスクの管理
- バックログからアジェンダへの移動
- タスクの削除と整理

### 🎨 カスタマイズ機能
- 3つのテーマ（Zenith、Dusk、Sunrise）
- 日本語・英語の多言語対応
- レスポンシブデザイン対応

### 🤖 AI統合機能
- 複数のAIプロバイダー対応（Google AI、OpenAI、Anthropic）
- タスク優先度の提案機能
- 設定画面でのAPIキー管理

## 🚀 技術スタック

- **フレームワーク**: Next.js 15.3.3 (React 18)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: Radix UI
- **AI統合**: Google AI Genkit
- **バックエンド**: Firebase
- **デプロイ**: Firebase App Hosting

## 📦 インストール

```bash
# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.localファイルを編集してAPIキーを設定

# 開発サーバーを起動
npm run dev
```

アプリケーションは http://localhost:9002 で起動します。

## 🔧 開発コマンド

```bash
# 開発サーバー起動（Turbopack使用）
npm run dev

# AI機能開発用サーバー
npm run genkit:dev
npm run genkit:watch

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# リンターチェック
npm run lint

# 型チェック
npm run typecheck
```

## 🌐 デプロイ

Firebase App Hostingを使用してデプロイできます。`apphosting.yaml`が設定済みです。

## 📁 プロジェクト構成

```
src/
├── app/                    # Next.js App Router
├── components/             # Reactコンポーネント
│   ├── layout/            # レイアウトコンポーネント
│   ├── tasks/             # タスク関連コンポーネント
│   ├── ai/                # AI機能コンポーネント
│   └── ui/                # UIコンポーネント（shadcn/ui）
├── context/               # React Context
├── hooks/                 # カスタムフック
├── lib/                   # ユーティリティ関数
└── ai/                    # AI機能実装
```

## 🔑 環境変数

以下の環境変数を`.env.local`で設定してください：

```
# AI API Keys（任意）
GOOGLE_AI_API_KEY=your_google_ai_key
OPENAI_API_KEY=your_openai_key  
ANTHROPIC_API_KEY=your_anthropic_key
```

## 📝 使い方

1. **タスク追加**: ヘッダーの「＋」ボタンからタスクを追加
2. **スケジュール設定**: 日時と推定作業時間を設定
3. **バックログ管理**: 右サイドバーで未スケジュールタスクを管理
4. **設定変更**: 右上の設定アイコンから言語・テーマ・AIプロバイダーを変更

## 🎯 特徴的な機能

- **時間重複検知**: スケジュールが重複するタスクを自動検知し警告表示
- **リマインダー**: 任意の時間前にリマインダーを設定可能
- **ドラッグ＆ドロップ**: バックログとアジェンダ間のタスク移動
- **プログレッシブWebApp**: オフライン対応とモバイル最適化

## 📄 ライセンス

このプロジェクトはプライベートライセンスです。

## 🤝 貢献

バグレポートや機能要望はIssuesでお知らせください。
