-- BJJ 스킬트리 앱 — Supabase 초기 스키마
-- 실행 방법: Supabase 대시보드 → SQL Editor → 새 쿼리 → 이 파일 전체 붙여넣기 → Run
-- (2026-07-31 작성, Phase 1 인증+데이터 전환용)

-- ============================================
-- 1. profiles — 유저 프로필 (벨트/그랄)
-- Airtable UserProfile 테이블을 대체. auth.users와 1:1
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text default '아쿠아',
  belt text not null default 'White Belt',
  stripe int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "본인 프로필만 조회" on public.profiles
  for select using (auth.uid() = id);

create policy "본인 프로필만 수정" on public.profiles
  for update using (auth.uid() = id);

-- 회원가입 시 자동으로 profiles row 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', '아쿠아'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 2. training_sessions — 수련 기록
-- Airtable TrainingSessions 테이블을 대체.
-- technique_ids / sequence_ids는 Airtable Techniques.ID 값(예: "CG-14")을 그대로 저장
-- (기술 마스터 콘텐츠는 계속 Airtable에 둠 — 하이브리드 구조)
-- ============================================
create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_date date not null,
  technique_ids text[] not null default '{}',
  sequence_ids uuid[] not null default '{}',
  notes text,
  xp_earned int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.training_sessions enable row level security;

create policy "본인 기록만 조회" on public.training_sessions
  for select using (auth.uid() = user_id);

create policy "본인 기록만 생성" on public.training_sessions
  for insert with check (auth.uid() = user_id);

create policy "본인 기록만 수정" on public.training_sessions
  for update using (auth.uid() = user_id);

create policy "본인 기록만 삭제" on public.training_sessions
  for delete using (auth.uid() = user_id);

-- ============================================
-- 3. sequences — 나만의 시퀀스 (개인 플레이북)
-- Airtable Sequences 테이블을 대체 (이건 유저 개인 데이터라 Supabase로 이전)
-- ============================================
create table if not exists public.sequences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  seq_name text not null,
  start_position text,
  technique_ids text[] not null default '{}',
  steps_text text,
  has_branch boolean not null default false,
  branch_condition text,
  tags text[] not null default '{}',
  success_count int not null default 0,
  last_used date,
  created_at timestamptz not null default now()
);

alter table public.sequences enable row level security;

create policy "본인 시퀀스만 조회" on public.sequences
  for select using (auth.uid() = user_id);

create policy "본인 시퀀스만 생성" on public.sequences
  for insert with check (auth.uid() = user_id);

create policy "본인 시퀀스만 수정" on public.sequences
  for update using (auth.uid() = user_id);

create policy "본인 시퀀스만 삭제" on public.sequences
  for delete using (auth.uid() = user_id);

-- training_sessions.sequence_ids가 sequences.id를 참조하므로 순서상 sequences 이후 FK 추가
alter table public.training_sessions
  drop constraint if exists training_sessions_sequence_ids_fkey;
-- (uuid[] 배열은 네이티브 FK 불가 — 애플리케이션 레벨에서 무결성 관리)

-- ============================================
-- 4. technique_goals — 학습 목표(찜한 기술)
-- 선수 상세 페이지에서 "이 기술 배우고 싶다"고 찜한 것을 저장.
-- technique_record_id / athlete_record_id는 Airtable recordId 문자열 그대로 저장
-- (2026-09-15 추가, 선수 시그니처 기술 학습 목표 기능)
-- ============================================
create table if not exists public.technique_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  technique_record_id text not null,
  athlete_record_id text,
  created_at timestamptz not null default now(),
  unique (user_id, technique_record_id)
);

alter table public.technique_goals enable row level security;

create policy "본인 목표만 조회" on public.technique_goals
  for select using (auth.uid() = user_id);

create policy "본인 목표만 생성" on public.technique_goals
  for insert with check (auth.uid() = user_id);

create policy "본인 목표만 삭제" on public.technique_goals
  for delete using (auth.uid() = user_id);

-- ============================================
-- 5. combo_feedback — AI 추천 게임플랜 👍/👎 (2026-10-10, 마이그레이션 combo_feedback_and_llm_cache)
-- 6. recommend_llm_cache — LLM 보조 결과 하루 캐시 (같은 입력은 재호출 안 함)
-- ============================================
create table if not exists public.combo_feedback (
  user_id uuid not null references auth.users(id) on delete cascade,
  combo_id text not null,
  vote smallint not null check (vote in (-1, 1)),
  updated_at timestamptz not null default now(),
  primary key (user_id, combo_id)
);
alter table public.combo_feedback enable row level security;
create policy "own feedback select" on public.combo_feedback for select using (auth.uid() = user_id);
create policy "own feedback insert" on public.combo_feedback for insert with check (auth.uid() = user_id);
create policy "own feedback update" on public.combo_feedback for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own feedback delete" on public.combo_feedback for delete using (auth.uid() = user_id);

create table if not exists public.recommend_llm_cache (
  user_id uuid not null references auth.users(id) on delete cascade,
  cache_key text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, cache_key)
);
alter table public.recommend_llm_cache enable row level security;
create policy "own cache select" on public.recommend_llm_cache for select using (auth.uid() = user_id);
create policy "own cache insert" on public.recommend_llm_cache for insert with check (auth.uid() = user_id);
create policy "own cache delete" on public.recommend_llm_cache for delete using (auth.uid() = user_id);

-- ============================================================
-- 보안 점검 (2026-10-17) — 적용 완료
-- ============================================================
-- 1) profiles: 클라이언트가 subscription_status를 직접 수정(무료 프리미엄)하지 못하게 컬럼 권한 제한.
--    subscription_status 는 서비스 롤(RevenueCat 웹훅)만 변경.
revoke insert, update on public.profiles from anon, authenticated;
grant update (nickname, belt, stripe, weekly_goal, reminder_hour, preferred_style_tag, onboarding_completed, updated_at)
  on public.profiles to authenticated;

-- 2) 트리거 전용 함수는 RPC 호출 불가
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- 3) RLS 성능: auth.uid() → (select auth.uid()) 로 전 정책 교체 (alter policy), FK 인덱스 추가
create index if not exists game_plans_user_id_idx on public.game_plans(user_id);
create index if not exists training_sessions_user_id_idx on public.training_sessions(user_id);

-- 2026-10-18: 온보딩 좋아하는 선수 선택
alter table public.profiles add column if not exists favorite_athlete_ids text[] not null default '{}';
grant update (favorite_athlete_ids) on public.profiles to authenticated;

-- 2026-10-18: 프로필 아바타 (preset=캐릭터 키, photo=Storage 경로)
alter table public.profiles
  add column if not exists avatar_type text check (avatar_type in ('preset','photo')),
  add column if not exists avatar_value text;
grant update (avatar_type, avatar_value) on public.profiles to authenticated;

-- 2026-10-18: 프로필 사진 Storage 버킷 (공개 읽기, 본인 폴더({user_id}/…)만 쓰기/수정/삭제, 512KB·jpeg/png/webp)
-- insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('avatars','avatars',true,524288,array['image/jpeg','image/png','image/webp']);
-- policies: avatars_insert_own / avatars_update_own / avatars_delete_own (bucket_id='avatars' and (storage.foldername(name))[1] = auth.uid()::text)
