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
    <div className="bg-white rounded-xl p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex gap-2 items-center mb-2">
        <div className="w-6 h-6 rounded-full bg-brown" />
        <div className="text-xs font-semibold text-dark">{nickname}</div>
        <div className="text-[10px] text-brown-dark">· {timeAgo}</div>
      </div>
      <div className="text-xs text-dark leading-relaxed">{content}</div>
      <div className="text-[11px] text-brown-dark mt-2">
        ❤️ {likes} · 💬 {comments}
      </div>
    </div>
  );
}
