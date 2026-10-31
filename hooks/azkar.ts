import type { Zikr } from '../types'

// One entry per zikr, shown in this order: the Arabic, its meaning, and the Arabic in Latin letters
// for terminals that can't show Arabic. Edit freely: add, remove or reorder.
export const AZKAR: Zikr[] = [
  { ar: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ', en: 'Glory be to Allah and praise be to Him', tr: 'Subhan Allahi wa bihamdihi' },
  { ar: 'سُبْحَانَ اللهِ الْعَظِيمِ', en: 'Glory be to Allah, the Most Great', tr: 'Subhan Allahil-Azim' },
  { ar: 'الْحَمْدُ لِلَّهِ', en: 'All praise is for Allah', tr: 'Alhamdu lillah' },
  { ar: 'اللهُ أَكْبَرُ', en: 'Allah is the Greatest', tr: 'Allahu Akbar' },
  { ar: 'لَا إِلَٰهَ إِلَّا اللهُ', en: 'There is no god but Allah', tr: 'La ilaha illallah' },
  { ar: 'أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ', en: "I seek Allah's forgiveness and repent to Him", tr: 'Astaghfirullaha wa atubu ilayh' },
  { ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ', en: 'There is no power nor strength except through Allah', tr: 'La hawla wa la quwwata illa billah' },
  { ar: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', en: 'O Allah, send prayers and peace upon our Prophet Muhammad', tr: 'Allahumma salli wa sallim ala nabiyyina Muhammad' },
  {
    ar: 'سُبْحَانَ اللهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَٰهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ',
    en: 'Glory be to Allah, praise be to Allah, no god but Allah, Allah is the Greatest',
    tr: 'Subhan Allah, walhamdu lillah, wa la ilaha illallah, wallahu akbar',
  },
  {
    ar: 'لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    en: 'None has the right to be worshipped but Allah alone; His is the dominion and the praise, and He is able to do all things',
    tr: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli shay'in qadir",
  },
  { ar: 'حَسْبِيَ اللهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ', en: 'Allah is sufficient for me; in Him I put my trust', tr: 'Hasbiyallahu la ilaha illa huwa, alayhi tawakkalt' },
  {
    ar: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    en: 'There is no god but You, glory be to You; I was among the wrongdoers',
    tr: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin',
  },
  {
    ar: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
    en: 'My Lord, forgive me and accept my repentance; You are the Accepting of repentance, the Merciful',
    tr: 'Rabbighfir li wa tub alayya innaka antat-tawwabur-rahim',
  },
  {
    ar: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
    en: 'Glory and praise be to Allah, as many as His creation, as pleases Him, as weighs His Throne, as much as the ink of His words',
    tr: 'Subhan Allahi wa bihamdihi, adada khalqihi, wa rida nafsihi, wa zinata arshihi, wa midada kalimatihi',
  },
  {
    ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the Fire',
    tr: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar',
  },
]
