-- お知らせテーブル
CREATE TABLE IF NOT EXISTS announcements (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content     TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'その他',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on announcements"
  ON announcements FOR SELECT USING (true);

CREATE POLICY "Allow public write on announcements"
  ON announcements FOR ALL USING (true) WITH CHECK (true);

-- 朝礼・終礼メモテーブル
CREATE TABLE IF NOT EXISTS memos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  memo_date   DATE NOT NULL UNIQUE,
  content     TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on memos"
  ON memos FOR SELECT USING (true);

CREATE POLICY "Allow public write on memos"
  ON memos FOR ALL USING (true) WITH CHECK (true);
