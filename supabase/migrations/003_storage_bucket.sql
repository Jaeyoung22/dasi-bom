-- photos 버킷 생성 (방문 인증 사진 저장)
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 누구나 사진 조회 가능
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

-- 인증된 유저만 업로드 가능
CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'photos');

-- 본인 업로드한 사진만 삭제 가능
CREATE POLICY "Owner delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'photos' AND auth.uid()::text = owner::text);
