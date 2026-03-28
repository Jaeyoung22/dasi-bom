/**
 * 소녀상 주소를 Kakao 지오코딩 API로 위도/경도로 변환하는 스크립트
 * 사용법: node scripts/geocode-statues.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REST_API_KEY = "92baa982e60244c65116d5c61feaa141";

const inputPath = resolve(__dirname, "../data/statues-seed.json");
const outputPath = resolve(__dirname, "../data/statues-with-coords.json");

async function geocode(address) {
  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;

  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
  });

  if (!res.ok) {
    // 주소 검색 실패 시 키워드 검색 시도
    const keywordUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(address)}`;
    const keywordRes = await fetch(keywordUrl, {
      headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
    });

    if (!keywordRes.ok) return null;
    const keywordData = await keywordRes.json();
    if (keywordData.documents && keywordData.documents.length > 0) {
      return {
        latitude: parseFloat(keywordData.documents[0].y),
        longitude: parseFloat(keywordData.documents[0].x),
      };
    }
    return null;
  }

  const data = await res.json();

  if (data.documents && data.documents.length > 0) {
    return {
      latitude: parseFloat(data.documents[0].y),
      longitude: parseFloat(data.documents[0].x),
    };
  }

  // 주소 결과 없으면 키워드 검색 시도
  const keywordUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(address)}`;
  const keywordRes = await fetch(keywordUrl, {
    headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
  });

  if (!keywordRes.ok) return null;
  const keywordData = await keywordRes.json();
  if (keywordData.documents && keywordData.documents.length > 0) {
    return {
      latitude: parseFloat(keywordData.documents[0].y),
      longitude: parseFloat(keywordData.documents[0].x),
    };
  }

  return null;
}

async function main() {
  const statues = JSON.parse(readFileSync(inputPath, "utf-8"));
  const results = [];
  let success = 0;
  let fail = 0;

  console.log(`총 ${statues.length}개 소녀상 지오코딩 시작...\n`);

  for (let i = 0; i < statues.length; i++) {
    const statue = statues[i];
    process.stdout.write(`[${i + 1}/${statues.length}] ${statue.name} ... `);

    const coords = await geocode(statue.address);

    if (coords) {
      results.push({ ...statue, ...coords });
      console.log(`✅ (${coords.latitude}, ${coords.longitude})`);
      success++;
    } else {
      // 좌표 없이 추가 (나중에 수동 보정)
      results.push({ ...statue, latitude: 0, longitude: 0 });
      console.log(`❌ 좌표를 찾을 수 없음`);
      fail++;
    }

    // API 속도 제한 방지 (100ms 딜레이)
    await new Promise((r) => setTimeout(r, 100));
  }

  writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");

  console.log(`\n완료! 성공: ${success}, 실패: ${fail}`);
  console.log(`결과 저장: ${outputPath}`);
}

main().catch(console.error);
