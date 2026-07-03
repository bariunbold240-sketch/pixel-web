export type Lang = 'mn' | 'en'

export const T = {
  mn: {
    nav: ['Алсын Хараа', 'Туршлага', 'Хамтрагчид', 'Багц', 'Холбоо барих'],
    panelNames: ['Эхлэл', 'Алсын Хараа', 'Туршлага', 'Хамтрагчид', 'Багц', 'Холбоо барих'],
    // Short, single-word labels for the mobile bottom tab bar — every one fits on
    // one line under its icon (the full names above wrapped to two lines).
    tabShort: ['Эхлэл', 'Алсын', 'Туршлага', 'Хамтрагч', 'Багц', 'Холбоо'],
  },
  en: {
    nav: ['Vision', 'About Us', 'Portfolio', 'Packages', 'Contact'],
    panelNames: ['Home', 'Vision', 'About Us', 'Portfolio', 'Packages', 'Contact'],
    tabShort: ['Home', 'Vision', 'Work', 'Partners', 'Plans', 'Contact'],
  },
} as const
