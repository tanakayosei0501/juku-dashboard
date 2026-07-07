-- Supabase SQL Editor でこのファイルを実行してください
-- ダッシュボード用の metrics テーブルを作成します

CREATE TABLE IF NOT EXISTS metrics (
  id          TEXT PRIMARY KEY,
  value       INTEGER NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 初期データ（3指標）を挿入
INSERT INTO metrics (id, value, updated_at)
VALUES
  ('current_students', 0, NOW()),
  ('dropouts',         0, NOW()),
  ('target',           0, NOW())
ON CONFLICT (id) DO NOTHING;

-- Row Level Security を有効化（公開アクセスを許可）
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- 読み取りポリシー（全ユーザー）
CREATE POLICY "Allow public read"
  ON metrics FOR SELECT
  USING (true);

-- 書き込みポリシー（全ユーザー）
-- ※ 認証を追加する場合はここを変更してください
CREATE POLICY "Allow public write"
  ON metrics FOR ALL
  USING (true)
  WITH CHECK (true);
