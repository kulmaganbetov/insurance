export const REGIONS = [
  { value: 'almaty_city', label: 'Алматы қ.' },
  { value: 'astana_city', label: 'Астана қ.' },
  { value: 'shymkent_city', label: 'Шымкент қ.' },
  { value: 'akmola', label: 'Ақмола облысы' },
  { value: 'aktobe', label: 'Ақтөбе облысы' },
  { value: 'almaty', label: 'Алматы облысы' },
  { value: 'atyrau', label: 'Атырау облысы' },
  { value: 'east_kaz', label: 'Шығыс Қазақстан облысы' },
  { value: 'zhambyl', label: 'Жамбыл облысы' },
  { value: 'west_kaz', label: 'Батыс Қазақстан облысы' },
  { value: 'karaganda', label: 'Қарағанды облысы' },
  { value: 'kostanay', label: 'Қостанай облысы' },
  { value: 'kyzylorda', label: 'Қызылорда облысы' },
  { value: 'mangystau', label: 'Маңғыстау облысы' },
  { value: 'pavlodar', label: 'Павлодар облысы' },
  { value: 'north_kaz', label: 'Солтүстік Қазақстан облысы' },
  { value: 'turkestan', label: 'Түркістан облысы' },
  { value: 'ulytau', label: 'Ұлытау облысы' },
  { value: 'abay', label: 'Абай облысы' },
  { value: 'zhetisu', label: 'Жетісу облысы' },
] as const;

export const INSURANCE_TYPES = [
  {
    value: 'endowment',
    label: 'Мерзім соңына дейін өмір сүру',
    description: 'Шарт мерзімі аяқталғанға дейін өмір сүргенде төлем жасалады',
  },
  {
    value: 'term_life',
    label: 'Қайтыс болу жағдайына (мерзімді)',
    description: 'Белгілі бір мерзімге жақындарыңызды қорғау',
  },
  {
    value: 'mixed',
    label: 'Аралас',
    description: 'Жинақтау мен қорғаныстың үйлесімі',
  },
  {
    value: 'whole_life',
    label: 'Өмір бойы',
    description: 'Өмір бойғы сақтандыру қорғанысы',
  },
  {
    value: 'pension_annuity',
    label: 'Зейнетақы аннуитеті',
    description: 'Зейнетке шыққаннан кейінгі тұрақты төлемдер',
  },
] as const;

export const LOADING_MESSAGES = [
  'Актуарлық кестелерді жүктеп жатырмыз...',
  'Тәуекел факторларын талдап жатырмыз...',
  'AI тарифті есептеп жатыр...',
  'Есепті дайындап жатырмыз...',
] as const;

export const BMI_CATEGORIES = [
  { max: 16, label: 'Айқын тапшылық', color: 'text-red-400' },
  { max: 18.5, label: 'Салмақ жеткіліксіз', color: 'text-yellow-400' },
  { max: 25, label: 'Қалыпты', color: 'text-emerald-400' },
  { max: 30, label: 'Артық салмақ', color: 'text-yellow-400' },
  { max: 35, label: 'Семіздік I дәреже', color: 'text-orange-400' },
  { max: 40, label: 'Семіздік II дәреже', color: 'text-red-400' },
  { max: Infinity, label: 'Семіздік III дәреже', color: 'text-red-500' },
] as const;
