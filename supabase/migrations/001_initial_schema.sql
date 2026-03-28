-- 다시, 봄 — 초기 DB 스키마

-- 사용자
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  provider TEXT NOT NULL DEFAULT 'kakao',
  total_badges INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 소녀상
CREATE TABLE statues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  description TEXT,
  image_url TEXT,
  installed_date DATE,
  region TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 방문 인증
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  statue_id UUID NOT NULL REFERENCES statues(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT true,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 뱃지
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  statue_id UUID REFERENCES statues(id) ON DELETE SET NULL,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('regional', 'first_visit', 'city_complete', 'national_complete')),
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, statue_id, badge_type)
);

-- 게시글
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  statue_id UUID NOT NULL REFERENCES statues(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  category TEXT NOT NULL CHECK (category IN ('status_report', 'impression')),
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 댓글
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 좋아요 (중복 방지)
CREATE TABLE likes (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- 인덱스
CREATE INDEX idx_visits_user_id ON visits(user_id);
CREATE INDEX idx_visits_statue_id ON visits(statue_id);
CREATE INDEX idx_badges_user_id ON badges(user_id);
CREATE INDEX idx_posts_statue_id ON posts(statue_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_statues_region ON statues(region);
CREATE INDEX idx_users_total_badges ON users(total_badges DESC);
