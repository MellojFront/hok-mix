import { supabase } from './supabase';
import { Mix } from '@/types';

// Получить официальные миксы (для всех пользователей)
export async function getOfficialMixes(): Promise<Mix[]> {
  const { data, error } = await supabase
    .from('mixes')
    .select('*')
    .eq('is_official', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching official mixes:', error);
    return [];
  }

  return data.map(transformMix);
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
  userId: string
): Promise<Mix | null> {
  // Валидация ингредиентов если они есть
  if (mix.ingredients) {
    const totalPercentage = mix.ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error(`Сумма процентов должна быть 100%. Сейчас: ${totalPercentage}%`);
    }
  }

  const { data, error } = await supabase
    .from('mixes')
    .update({
      title: mix.title,
      description: mix.description,
      ingredients: mix.ingredients,
      author_name: mix.author_name,
    })
    .eq('id', id)
    .eq('created_by', userId) // Только свои миксы
    .select()
    .single();

  if (error) {
    console.error('Error updating mix:', error);
    throw error;
  }

  return transformMix(data);
}

// Удалить микс
export async function deleteMix(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('mixes')
    .delete()
    .eq('id', id)
    .eq('created_by', userId); // Только свои миксы

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
    is_official: data.is_official,
  };
}

