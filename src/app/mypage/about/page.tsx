import Header from "@/components/ui/Header";

export default function AboutPage() {
  return (
    <div>
      <Header title="앱 정보" subtitle="다시, 봄" showBack />

      <div className="px-5 py-6">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🕊️</div>
          <h2 className="text-lg font-bold text-dark">다시, 봄</h2>
          <p className="text-xs text-brown-dark mt-1">빼앗긴 봄을 되찾습니다</p>
          <p className="text-[10px] text-brown-dark/60 mt-1">v1.0.0</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-bold text-dark mb-2">소개</h3>
            <p className="text-xs text-brown-dark leading-relaxed">
              &quot;다시, 봄&quot;은 전국에 설치된 평화의 소녀상을 방문하고
              인증하는 앱입니다. 소녀상을 방문하며 역사를 기억하고,
              봄을 되찾아가는 여정에 함께해주세요.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-bold text-dark mb-2">기능</h3>
            <ul className="text-xs text-brown-dark space-y-1.5">
              <li>📍 전국 84개 소녀상 지도</li>
              <li>📸 GPS 기반 방문 인증</li>
              <li>🏅 지역별/특별 뱃지 수집</li>
              <li>📝 방문 소감 및 상태 보고</li>
              <li>🏆 방문자 랭킹</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-bold text-dark mb-2">문의</h3>
            <p className="text-xs text-brown-dark">
              버그 리포트나 건의사항은 GitHub Issues로 남겨주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
