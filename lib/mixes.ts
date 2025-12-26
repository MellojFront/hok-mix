import { supabase } from './supabase';
import { Mix } from '@/types';

// Получить официальные и публичные миксы (для всех пользователей)
export async function getOfficialMixes(): Promise<Mix[]> {
  try {
    // Проверяем, что Supabase настроен
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      console.warn('Supabase not configured. Returning empty array.');
      return [];
    }

    const { data, error } = await supabase
      .from('mixes')
      .select('*')
      .or('is_official.eq.true,is_public.eq.true')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching official mixes:', {
        message: error.message || 'Unknown error',
        details: error.details || 'No details',
        hint: error.hint || 'No hint',
        code: error.code || 'No code',
        fullError: JSON.stringify(error, null, 2),
      });
      return [];
    }

    if (!data) {
      console.warn('No data returned from getOfficialMixes');
      return [];
    }

    return data.map(transformMix);
  } catch (err: any) {
    console.error('Exception in getOfficialMixes:', {
      message: err?.message || 'Unknown exception',
      stack: err?.stack,
      error: err,
    });
    return [];
  }
}

// Получить личные миксы пользователя
export async function getUserMixes(userId: string): Promise<Mix[]> {
  const { data, error } = await supabase
    .from('mixes')
    .select('*')
    .eq('created_by', userId)
    .eq('is_official', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user mixes:', error);
    return [];
  }

  return data.map(transformMix);
}

// Создать микс
export async function createMix(
  mix: Omit<Mix, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string,
  isOfficial: boolean = false
): Promise<Mix | null> {
  // Валидация
  if (!mix.title || !mix.description || !mix.ingredients || mix.ingredients.length === 0) {
    throw new Error('Заполните все обязательные поля');
  }

  const totalPercentage = mix.ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error(`Сумма процентов должна быть 100%. Сейчас: ${totalPercentage}%`);
  }

  const { data, error } = await supabase
    .from('mixes')
    .insert({
      title: mix.title,
      description: mix.description,
      ingredients: mix.ingredients,
      is_official: isOfficial,
      created_by: userId,
      author_name: mix.author_name || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating mix:', error);
    throw error;
  }

  return transformMix(data);
}

// Обновить микс
export async function updateMix(
  id: string,
  mix: Partial<Mix>,
  userId: string,
  isAdmin: boolean = false
): Promise<Mix | null> {
  // Валидация ингредиентов если они есть
  if (mix.ingredients) {
    const totalPercentage = mix.ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error(`Сумма процентов должна быть 100%. Сейчас: ${totalPercentage}%`);
    }
  }

  let query = supabase
    .from('mixes')
    .update({
      title: mix.title,
      description: mix.description,
      ingredients: mix.ingredients,
      author_name: mix.author_name,
      is_official: mix.is_official,
      is_public: mix.is_public,
    })
    .eq('id', id);

  // Если не админ, проверяем что это его микс
  if (!isAdmin) {
    query = query.eq('created_by', userId);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error('Error updating mix:', error);
    throw error;
  }

  return transformMix(data);
}

// Опубликовать микс (сделать is_official=true) - только для админов
export async function publishMix(id: string): Promise<Mix | null> {
  const { data, error } = await supabase
    .from('mixes')
    .update({ is_official: true })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error publishing mix:', error);
    throw error;
  }

  return transformMix(data);
}

// Удалить микс (админ может удалять любые, пользователь только свои)
export async function deleteMix(id: string, userId: string, isAdmin: boolean = false): Promise<void> {
  let query = supabase.from('mixes').delete().eq('id', id);

  // Если не админ, проверяем что это его микс
  if (!isAdmin) {
    query = query.eq('created_by', userId);
  }

  const { error } = await query;

  if (error) {
    console.error('Error deleting mix:', error);
    throw error;
  }
}


// Предложить микс для публикации
export async function submitMixForApproval(
  mix: Omit<Mix, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
): Promise<void> {
  // Валидация
  if (!mix.title || !mix.description || !mix.ingredients || mix.ingredients.length === 0) {
    throw new Error('Заполните все обязательные поля');
  }

  const totalPercentage = mix.ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error(`Сумма процентов должна быть 100%. Сейчас: ${totalPercentage}%`);
  }

  const { error } = await supabase.from('mix_submissions').insert({
    title: mix.title,
    description: mix.description,
    ingredients: mix.ingredients,
    submitted_by: userId,
    status: 'pending',
  });

  if (error) {
    console.error('Error submitting mix:', error);
    throw error;
  }
}

// Преобразование данных из БД в формат Mix
function transformMix(data: any): Mix {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    ingredients: data.ingredients,
    createdAt: new Date(data.created_at).getTime(),
    updatedAt: new Date(data.updated_at).getTime(),
    author_name: data.author_name,
    is_official: data.is_official || false,
    is_public: data.is_public || false,
    created_by: data.created_by,
  };
}

