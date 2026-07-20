export interface VisionValue {
  number: string
  text: string
}

export interface TeamMember {
  name: string
  role: string
  experience: string
  color: string
}

export interface WorkProject {
  tag: string
  title: string
  description: string
}

export interface PackageFeature {
  label: string
  value: string
}

export interface PackagePlan {
  name: string
  price: string
  featured?: boolean
  features: PackageFeature[]
}

export const visionValues: VisionValue[] = [
  { number: '01', text: 'Зөв мессежийг зөв газарт хүргэнэ' },
  { number: '02', text: 'Итгэл ба ёс зүйг эрхэмлэнэ' },
  { number: '03', text: 'Хамтын өсөлтийг бүтээнэ' },
]

export const teamMembers: TeamMember[] = [
  {
    name: 'Х. Энхбаясгалан',
    role: 'График дизайнер · Бизнесийн удирдлагын магистрант',
    experience: '11 жилийн туршлагатай',
    color: '#ec6b1f',
  },
  {
    name: 'Т. Номинзул',
    role: 'Эдийн засагч · PR мэргэжилтэн',
    experience: '4 жилийн туршлагатай',
    color: '#d400ff',
  },
  {
    name: 'М. Мөнх-Эрдэнэ',
    role: 'Монголын өмгөөлөгчдийн холбооны хуульч',
    experience: 'Хуулийн зөвлөх',
    color: '#1e6fd4',
  },
  {
    name: 'Ц. Эгшигмаа',
    role: 'Хүний нөөцийн менежер',
    experience: '3 жилийн туршлагатай',
    color: '#15a59a',
  },
  {
    name: 'Ш. Мөнх-Эрдэнэ',
    role: 'Маркетингийн менежер',
    experience: '3 жилийн туршлагатай',
    color: '#c0398a',
  },
  {
    name: 'Б. Амартүвшин',
    role: 'IT инженер',
    experience: '3 жилийн туршлагатай',
    color: '#7b18d4',
  },
]

export const workProjects: WorkProject[] = [
  {
    tag: 'Дижитал бүтээгдэхүүн',
    title: 'GYMHUB фитнесс хөтөлбөр',
    description:
      'Фитнесс гишүүнчлэлийн менежментийн платформ — хэрэглэгч, төлбөр, компани, дашбоард аналитик.',
  },
  {
    tag: 'Вэбсайт',
    title: 'Nova Mind Академ',
    description:
      'Боловсролын төвийн вэбсайт — хөтөлбөрийн каталог, бүртгэл, хоёр хэлний интерфэйс.',
  },
  {
    tag: 'Сошиал хөтлөлт',
    title: 'Bluebell Flower Shop',
    description:
      'Instagram контент, брэндинг ба фолловер өсөлт — 1,065+ дагагч, тогтмол рийл бүтээл.',
  },
  {
    tag: 'Сошиал хөтлөлт',
    title: 'Модон Гэрийн Тавилга',
    description:
      'Facebook хуудасны хөтлөлт ба контент — 5.3K дагагчтай дижитал бүтээгч хуудас.',
  },
]

export const packagePlans: PackagePlan[] = [
  {
    name: 'Pixel Early',
    price: '',
    features: [
      { label: 'Календарчилсан төлөвлөгөө', value: '1' },
      { label: 'Зах зээлийн судалгаа',      value: '1' },
      { label: 'Рийл бичлэг',               value: '1' },
      { label: 'FB IG постер',               value: '5' },
      { label: 'Fb Cover, Profile',          value: '1' },
      { label: 'Тайлан',                     value: '1' },
      { label: 'Зураг авалт',               value: '—' },
      { label: 'Грйфик дазайны ажил',      value: '—' },
      { label: 'Chat bot',                   value: '1' },
      { label: 'Web сайт',                   value: '—' },
      { label: 'App',                        value: '—' },
    ],
  },
  {
    name: 'Pixel Smart',
    price: '',
    features: [
      { label: 'Календарчилсан төлөвлөгөө', value: '1' },
      { label: 'Зах зээлийн судалгаа',      value: '1' },
      { label: 'Рийл бичлэг',               value: '2' },
      { label: 'FB IG постер',               value: '7' },
      { label: 'Fb Cover, Profile',          value: '1' },
      { label: 'Тайлан',                     value: '1' },
      { label: 'Зураг авалт',               value: '—' },
      { label: 'Грйфик дазайны ажил',      value: '—' },
      { label: 'Chat bot',                   value: '1' },
      { label: 'Web сайт',                   value: '—' },
      { label: 'App',                        value: '—' },
    ],
  },
  {
    name: 'Pixel Basic',
    price: '',
    features: [
      { label: 'Календарчилсан төлөвлөгөө', value: '1' },
      { label: 'Зах зээлийн судалгаа',      value: '1' },
      { label: 'Рийл бичлэг',               value: '3' },
      { label: 'FB IG постер',               value: '9' },
      { label: 'Fb Cover, Profile',          value: '1' },
      { label: 'Тайлан',                     value: '1' },
      { label: 'Зураг авалт',               value: '—' },
      { label: 'Грйфик дазайны ажил',      value: '—' },
      { label: 'Chat bot',                   value: '1' },
      { label: 'Web сайт',                   value: '—' },
      { label: 'App',                        value: '—' },
    ],
  },
  {
    name: 'Pixel Total',
    price: '',
    features: [
      { label: 'Календарчилсан төлөвлөгөө', value: '1' },
      { label: 'Зах зээлийн судалгаа',      value: '1' },
      { label: 'Рийл бичлэг',               value: '5' },
      { label: 'FB IG постер',               value: '10' },
      { label: 'Fb Cover, Profile',          value: '1' },
      { label: 'Тайлан',                     value: '1' },
      { label: 'Зураг авалт',               value: '—' },
      { label: 'Грийфик дазайны ажил',      value: '—' },
      { label: 'Chat bot',                   value: '1' },
      { label: 'Web сайт',                   value: '—' },
      { label: 'App',                        value: '—' },
    ],
  },
  {
    name: 'Pixel Elite',
    price: '',
    features: [
      { label: 'Календарчилсан төлөвлөгөө', value: '1' },
      { label: 'Зах зээлийн судалгаа',      value: '1' },
      { label: 'Рийл бичлэг',               value: '7' },
      { label: 'FB IG постер',               value: '12' },
      { label: 'Fb Cover, Profile',          value: '1' },
      { label: 'Тайлан',                     value: '1' },
      { label: 'Зураг авалт',               value: '—' },
      { label: 'Грйфик дазайны ажил',      value: '—' },
      { label: 'Chat bot',                   value: '1' },
      { label: 'Web сайт',                   value: '—' },
      { label: 'App',                        value: '—' },
    ],
  },
  {
    name: 'Pixel Premium',
    price: '',
    features: [
      { label: 'Календарчилсан төлөвлөгөө', value: '1' },
      { label: 'Зах зээлийн судалгаа',      value: '1' },
      { label: 'Рийл бичлэг',               value: '8' },
      { label: 'FB IG постер',               value: '13' },
      { label: 'Fb Cover, Profile',          value: '1' },
      { label: 'Тайлан',                     value: '1' },
      { label: 'Зураг авалт',               value: '—' },
      { label: 'Грйфик дазайны ажил',      value: '—' },
      { label: 'Chat bot',                   value: '1' },
      { label: 'Web сайт',                   value: '—' },
      { label: 'App',                        value: '—' },
    ],
  },
  {
    name: 'Pixel Apex',
    price: '',
    features: [
      { label: 'Календарчилсан төлөвлөгөө', value: '1' },
      { label: 'Зах зээлийн судалгаа',      value: '1' },
      { label: 'Рийл бичлэг',               value: '9' },
      { label: 'FB IG постер',               value: '14' },
      { label: 'Fb Cover, Profile',          value: '1' },
      { label: 'Тайлан',                     value: '1' },
      { label: 'Зураг авалт',               value: '—' },
      { label: 'Грийфик дазайны ажил',      value: '5' },
      { label: 'Chat bot',                   value: '1' },
      { label: 'Web сайт',                   value: '1' },
      { label: 'App',                        value: '—' },
    ],
  },
  {
    name: 'Pixel Core',
    price: '',
    featured: true,
    features: [
      { label: 'Календарчилсан төлөвлөгөө', value: '1' },
      { label: 'Зах зээлийн судалгаа',      value: '1' },
      { label: 'Рийл бичлэг',               value: '10' },
      { label: 'FB IG постер',               value: '15' },
      { label: 'Fb Cover, Profile',          value: '1' },
      { label: 'Тайлан',                     value: '1' },
      { label: 'Зураг авалт',               value: '1' },
      { label: 'Грйфик дазайны ажил',      value: '10' },
      { label: 'Chat bot',                   value: '1' },
      { label: 'Web сайт',                   value: '1' },
      { label: 'App',                        value: '1' },
    ],
  },
]

export const contactPhone = '87114000'

// Numeric Facebook Page id, taken from the page URL (facebook.com/profile.php?id=…).
// m.me resolves numeric ids as well as usernames, so this doubles as the chat link.
export const messengerPageId = '61586873402217'
