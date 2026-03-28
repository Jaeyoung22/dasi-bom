export interface Statue {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  image_url: string | null;
  installed_date: string | null;
  region: string;
  created_at: string;
}

export interface User {
  id: string;
  nickname: string;
  avatar_url: string | null;
  provider: "kakao" | "naver" | "google";
  total_badges: number;
  created_at: string;
}

export interface Visit {
  id: string;
  user_id: string;
  statue_id: string;
  photo_url: string;
  verified: boolean;
  visited_at: string;
}

export interface Badge {
  id: string;
  user_id: string;
  statue_id: string | null;
  badge_type: "regional" | "first_visit" | "city_complete" | "national_complete";
  badge_name: string;
  earned_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  statue_id: string;
  title: string;
  content: string;
  image_urls: string[];
  category: "status_report" | "impression";
  likes_count: number;
  created_at: string;
  user?: User;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: User;
}
