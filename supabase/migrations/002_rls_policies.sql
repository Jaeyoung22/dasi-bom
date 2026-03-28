-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE statues ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- statues: 누구나 조회 가능
CREATE POLICY "statues_select" ON statues FOR SELECT USING (true);

-- users: 누구나 조회, 본인만 수정
CREATE POLICY "users_select" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (auth.uid() = auth_id);
CREATE POLICY "users_update" ON users FOR UPDATE USING (auth.uid() = auth_id);

-- visits: 누구나 조회, 본인만 생성
CREATE POLICY "visits_select" ON visits FOR SELECT USING (true);
CREATE POLICY "visits_insert" ON visits FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- badges: 누구나 조회
CREATE POLICY "badges_select" ON badges FOR SELECT USING (true);
CREATE POLICY "badges_insert" ON badges FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- posts: 누구나 조회, 본인만 생성/수정/삭제
CREATE POLICY "posts_select" ON posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);
CREATE POLICY "posts_update" ON posts FOR UPDATE USING (
  user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);
CREATE POLICY "posts_delete" ON posts FOR DELETE USING (
  user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- comments: 누구나 조회, 본인만 생성/삭제
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (
  user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- likes: 누구나 조회, 본인만 생성/삭제
CREATE POLICY "likes_select" ON likes FOR SELECT USING (true);
CREATE POLICY "likes_insert" ON likes FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);
CREATE POLICY "likes_delete" ON likes FOR DELETE USING (
  user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);
