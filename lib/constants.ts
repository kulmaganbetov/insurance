export const REGIONS = [
  { value: 'almaty_city', label: 'г. Алматы' },
  { value: 'astana_city', label: 'г. Астана' },
  { value: 'shymkent_city', label: 'г. Шымкент' },
  { value: 'akmola', label: 'Акмолинская область' },
  { value: 'aktobe', label: 'Актюбинская область' },
  { value: 'almaty', label: 'Алматинская область' },
  { value: 'atyrau', label: 'Атырауская область' },
  { value: 'east_kaz', label: 'Восточно-Казахстанская область' },
  { value: 'zhambyl', label: 'Жамбылская область' },
  { value: 'west_kaz', label: 'Западно-Казахстанская область' },
  { value: 'karaganda', label: 'Карагандинская область' },
  { value: 'kostanay', label: 'Костанайская область' },
  { value: 'kyzylorda', label: 'Кызылординская область' },
  { value: 'mangystau', label: 'Мангистауская область' },
  { value: 'pavlodar', label: 'Павлодарская область' },
  { value: 'north_kaz', label: 'Северо-Казахстанская область' },
  { value: 'turkestan', label: 'Туркестанская область' },
  { value: 'ulytau', label: 'Область Ұлытау' },
  { value: 'abay', label: 'Область Абай' },
  { value: 'zhetisu', label: 'Область Жетісу' },
] as const;

export const INSURANCE_TYPES = [
  {
    value: 'endowment',
    label: 'На дожитие',
    description: 'Выплата при дожитии до окончания срока договора',
  },
  {
    value: 'term_life',
    label: 'На случай смерти (срочное)',
    description: 'Защита близких на определённый срок',
  },
  {
    value: 'mixed',
    label: 'Смешанное',
    description: 'Комбинация накопления и защиты',
  },
  {
    value: 'whole_life',
    label: 'Пожизненное',
    description: 'Пожизненная страховая защита',
  },
  {
    value: 'pension_annuity',
    label: 'Пенсионная рента',
    description: 'Регулярные выплаты после выхода на пенсию',
  },
] as const;

export const LOADING_MESSAGES = [
  'Запрашиваем актуарные таблицы...',
  'Анализируем факторы риска...',
  'AI рассчитывает тариф...',
  'Готовим отчёт...',
] as const;

export const BMI_CATEGORIES = [
  { max: 16, label: 'Выраженный дефицит', color: 'text-red-400' },
  { max: 18.5, label: 'Недостаточная масса', color: 'text-yellow-400' },
  { max: 25, label: 'Норма', color: 'text-emerald-400' },
  { max: 30, label: 'Избыточный вес', color: 'text-yellow-400' },
  { max: 35, label: 'Ожирение I степени', color: 'text-orange-400' },
  { max: 40, label: 'Ожирение II степени', color: 'text-red-400' },
  { max: Infinity, label: 'Ожирение III степени', color: 'text-red-500' },
] as const;
