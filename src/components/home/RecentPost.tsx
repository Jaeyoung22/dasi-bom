interface RecentPostProps {
  nickname: string;
  timeAgo: string;
  content: string;
  likes: number;
  comments: number;
}

export default function RecentPost({
  nickname,
  timeAgo,
  content,
  likes,
  comments,
}: RecentPostProps) {
  return (
    <div className="relative bg-surface rounded-xl p-4 border border-border/30 card-hover overflow-hidden group">
      {/* 왼쪽 액센트 바 */}
      <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-gradient-to-b from-brown/30 via-brown/10 to-transparent rounded-full" />

      <div className="pl-3">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-warm/60 to-brown/40 flex items-center justify-center text-[9px] text-white font-bold">
            {nickname.charAt(0)}
          </div>
          <span className="text-[12px] font-semibold text-dark">{nickname}</span>
          <span className="text-[9px] text-brown-dark/35 ml-auto">{timeAgo}</span>
        </div>
        <div className="text-[13px] text-dark/80 leading-[1.8] line-clamp-2" style={{ fontFamily: "var(--font-serif), 'Noto Serif KR', serif" }}>
          {content}
        </div>
        <div className="flex gap-4 mt-3 text-[10px] text-brown-dark/40">
          <span className="group-hover:text-brown-dark/60 transition-colors">♥ {likes}</span>
          <span className="group-hover:text-brown-dark/60 transition-colors">💬 {comments}</span>
        </div>
      </div>
    </div>
  );
}
