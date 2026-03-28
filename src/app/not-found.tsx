import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-5">
      <div className="text-6xl mb-4">🕊️</div>
      <h1 className="text-xl font-bold text-dark">페이지를 찾을 수 없어요</h1>
      <p className="text-sm text-brown-dark mt-2 mb-6">
        길을 잃은 것 같아요. 홈으로 돌아갈까요?
      </p>
      <Link
        href="/"
        className="bg-brown text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
