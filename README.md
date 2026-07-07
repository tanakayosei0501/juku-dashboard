# 鶴瀬東専用ダッシュボード

塾内部向けの運営ダッシュボードです。生徒数指標の管理・お知らせの掲示・朝礼終礼メモの記録ができます。

## 公開URL
https://juku-dashboard-sigma.vercel.app/

## 機能
- **生徒数指標** — 現在の生徒数・退塾数・目標を管理（週次更新アラート付き）
- **お知らせ** — カテゴリ別・キーワード検索で絞り込み可能なお知らせ掲示板
- **朝礼・終礼メモ** — 日付ごとのメモ記録・過去メモの検索
- **編集パスワード保護** — 編集系操作には共通パスワードが必要（閲覧は誰でも可）

## 技術スタック
- シングル `index.html`（HTML/CSS/JS 一体型）
- Supabase JS クライアント（CDN経由）
- Vercel スタティックホスティング + Serverless Functions（`api/`）
- PWA 対応（manifest.json / Service Worker）

## Supabaseテーブル構成
| テーブル | 用途 |
|---|---|
| `metrics` | 生徒数指標 3行固定 |
| `announcements` | お知らせ（id, content, category, created_at, updated_at） |
| `memos` | 朝礼・終礼メモ（id, memo_date UNIQUE, content, created_at, updated_at） |

## 環境変数（Vercel）
| 変数名 | 説明 |
|---|---|
| `EDIT_PASSWORD` | 編集操作を保護するパスワード |

## Supabase テーブル作成 SQL
```sql
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memo_date DATE NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## デプロイ
GitHubにpush → Vercelが自動デプロイ
