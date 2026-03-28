# 다시, 봄 — 프로젝트 가이드

## 프로젝트 개요
위안부 피해자 기념 전국 평화의 소녀상 방문 인증 웹앱 (PWA)

## 기술 스택
- Next.js 14+ (App Router) + TypeScript
- Tailwind CSS (커스텀 크림/베이지 테마)
- Supabase (PostgreSQL + Auth + Storage)
- Kakao Map API
- Vercel 배포

## 핵심 명령어
```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```

## 디렉토리 구조
```
src/
  app/           # Next.js App Router 페이지
  components/    # 리액트 컴포넌트
    ui/          # 공통 UI (Button, Card, Badge 등)
    home/        # 홈 화면 컴포넌트
    map/         # 지도 화면 컴포넌트
    badges/      # 뱃지 컴포넌트
    posts/       # 게시판 컴포넌트
    ranking/     # 랭킹 컴포넌트
  lib/           # 유틸리티, 클라이언트 설정
data/            # 시드 데이터 (소녀상 JSON)
scripts/         # 데이터 수집 스크립트
supabase/        # DB 마이그레이션, 시드
```

## 컬러 팔레트
- `dark` (#3d3529) — 메인 다크, 헤더/네비
- `cream` (#fdf6e3) — 메인 배경
- `brown` (#c4956a) — 포인트, 액티브
- `brown-dark` (#8b7355) — 보조 텍스트
- `beige` (#e8dcc8) — 카드 보더, 서브 배경
- `surface-muted` (#f5f0e8) — 연한 배경

## 코딩 컨벤션
- 컴포넌트: PascalCase (e.g., `BottomNav.tsx`)
- 유틸: camelCase (e.g., `calculateDistance.ts`)
- 한국어 주석 OK, 변수/함수명은 영어
- 모바일 퍼스트: max-width 430px 기준

## 뱃지 네이밍
- 지역별: "○○의 봄" (종로의 봄, 마포의 봄 등)
- 특별: 첫 번째 봄, 서울의 봄, 전국의 봄

@AGENTS.md
