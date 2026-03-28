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
    <div className="bg-surface rounded-xl p-4 border border-border/30 card-hover">
      <div className="flex gap-2.5 items-center mb-2.5">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brown/80 to-brown-dark flex items-center justify-center text-[10px] text-white font-bold">
          {nickname.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold text-dark">{nickname}</span>
          <span className="text-[10px] text-brown-dark/50 ml-1.5">{timeAgo}</span>
        </div>
      </div>
      <div className="text-[13px] text-dark/90 leading-[1.7] line-clamp-2">{content}</div>
      <div className="flex gap-3 mt-3 text-[10px] text-brown-dark/60">
        <span>♥ {likes}</span>
        <span>💬 {comments}</span>
      </div>
    </div>
  );
}
