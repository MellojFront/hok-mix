-- Создание таблицы миксов
CREATE TABLE IF NOT EXISTS mixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  ingredients JSONB NOT NULL,
  is_official BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создание таблицы предложений миксов
CREATE TABLE IF NOT EXISTS mix_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mix_id UUID REFERENCES mixes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  ingredients JSONB NOT NULL,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_mixes_is_official ON mixes(is_official);
CREATE INDEX IF NOT EXISTS idx_mixes_created_by ON mixes(created_by);
CREATE INDEX IF NOT EXISTS idx_mix_submissions_submitted_by ON mix_submissions(submitted_by);
CREATE INDEX IF NOT EXISTS idx_mix_submissions_status ON mix_submissions(status);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для обновления updated_at
CREATE TRIGGER update_mixes_updated_at BEFORE UPDATE ON mixes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mix_submissions_updated_at BEFORE UPDATE ON mix_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) политики

-- Включаем RLS
ALTER TABLE mixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mix_submissions ENABLE ROW LEVEL SECURITY;

-- Политики для mixes:
-- 1. Все могут читать официальные миксы
CREATE POLICY "Anyone can read official mixes"
  ON mixes FOR SELECT
  USING (is_official = true);

-- 2. Пользователи могут читать свои миксы
CREATE POLICY "Users can read their own mixes"
  ON mixes FOR SELECT
  USING (auth.uid() = created_by);

-- 3. Пользователи могут создавать свои миксы
CREATE POLICY "Users can create their own mixes"
  ON mixes FOR INSERT
  WITH CHECK (auth.uid() = created_by AND is_official = false);

-- 4. Пользователи могут обновлять свои миксы
CREATE POLICY "Users can update their own mixes"
  ON mixes FOR UPDATE
  USING (auth.uid() = created_by AND is_official = false)
  WITH CHECK (auth.uid() = created_by AND is_official = false);

-- 5. Пользователи могут удалять свои миксы
CREATE POLICY "Users can delete their own mixes"
  ON mixes FOR DELETE
  USING (auth.uid() = created_by AND is_official = false);

-- 6. Админы могут делать все с официальными миксами
-- (Нужно будет создать функцию для проверки админа)
CREATE POLICY "Admins can manage official mixes"
  ON mixes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Политики для mix_submissions:
-- 1. Пользователи могут создавать предложения
CREATE POLICY "Users can create submissions"
  ON mix_submissions FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

-- 2. Пользователи могут читать свои предложения
CREATE POLICY "Users can read their own submissions"
  ON mix_submissions FOR SELECT
  USING (auth.uid() = submitted_by);

-- 3. Админы могут читать все предложения
CREATE POLICY "Admins can read all submissions"
  ON mix_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- 4. Админы могут обновлять статус предложений
CREATE POLICY "Admins can update submissions"
  ON mix_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Функция для проверки является ли пользователь админом
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

