"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-5">
      <div className="text-6xl mb-4">😢</div>
      <h1 className="text-xl font-bold text-dark">문제가 발생했어요</h1>
      <p className="text-sm text-brown-dark mt-2 mb-6">
        잠시 후 다시 시도해주세요
      </p>
      <button
        onClick={reset}
        className="bg-brown text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
      >
        다시 시도
      </button>
    </div>
  );
}
