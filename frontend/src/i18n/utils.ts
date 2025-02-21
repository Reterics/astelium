import {SelectOption} from '../components/SelectComponent.tsx';
import {TFunction} from 'i18next';

export const getTranslatedList = (
  list: string[],
  t: TFunction,
  prefix?: string
): SelectOption[] => {
  return list.map((item) => ({
    label: t((prefix ?? '') + item),
    value: item,
  }));
};
