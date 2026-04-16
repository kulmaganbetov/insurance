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
    label: 'Өмір сүруге',
    description: 'Шарт мерзімі аяқталғанға дейін өмір сүрген кезде төлем',
  },
  {
    value: 'term_life',
    label: 'Қайтыс болу жағдайына (мерзімді)',
    description: 'Белгілі мерзімге жақындарыңызды қорғау',
  },
  {
    value: 'mixed',
    label: 'Аралас',
    description: 'Жинақтау мен қорғаудың тіркесімі',
  },
  {
    value: 'whole_life',
    label: 'Өмір бойы',
    description: 'Өмір бойы сақтандыру қорғауы',
  },
  {
    value: 'pension_annuity',
    label: 'Зейнетақы рентасы',
    description: 'Зейнетке шыққаннан кейін тұрақты төлемдер',
  },
] as const;

export const LOADING_MESSAGES = [
  'Актуарлық кестелерді сұрап жатырмыз...',
  'Тәуекел факторларын талдап жатырмыз...',
  'AI тарифті есептеп жатыр...',
  'Есепті дайындап жатырмыз...',
] as const;

export const BMI_CATEGORIES = [
  { max: 16, label: 'Айқын тапшылық', color: 'text-red-400' },
  { max: 18.5, label: 'Жеткіліксіз салмақ', color: 'text-yellow-400' },
  { max: 25, label: 'Қалыпты', color: 'text-emerald-400' },
  { max: 30, label: 'Артық салмақ', color: 'text-yellow-400' },
  { max: 35, label: 'I дәрежелі семіздік', color: 'text-orange-400' },
  { max: 40, label: 'II дәрежелі семіздік', color: 'text-red-400' },
  { max: Infinity, label: 'III дәрежелі семіздік', color: 'text-red-500' },
] as const;
