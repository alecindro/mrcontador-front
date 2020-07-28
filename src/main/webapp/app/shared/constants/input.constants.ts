export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const MESES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
type MESID = typeof MESES[number];
export const MESLABELS: Record<MESID, string> = {
  1: 'JANEIRO',
  2: 'FEVEREIRO',
  3: 'MARÇO',
  4: 'ABRIL',
  5: 'MAIO',
  6: 'JUNHO',
  7: 'JULHO',
  8: 'AGOSTO',
  9: 'SETEMBRO',
  10: 'OUTUBRO',
  11: 'NOVEMBRO',
  12: 'DEZEMBRO',
} as const;
