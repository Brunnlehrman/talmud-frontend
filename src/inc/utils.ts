import * as numeral from 'numeral';
import { iLink } from '../types/types';
import { iMishnaForNavigation } from '../components/shared/ChooseMishna/ChooseMishna';

export function getNext(
  tractate: string,
  chapter: string,
  mishna: string,
  line: string,
  mishnaDoc: iMishnaForNavigation | null
): iLink | null {
  if (!mishnaDoc?.next) {
    return null;
  }
  if (!line) {
    return mishnaDoc.next;
  }
  const nextLine = numeral(parseInt(line) + 1).format('00000');
  const lineObj = mishnaDoc?.lines?.find((lineItem) => lineItem.lineNumber === nextLine);
  if (lineObj) {
    return {
      tractate,
      chapter,
      mishna,
      lineNumber: nextLine,
    };
  } else {
    if (mishnaDoc.next) {
      return {
        ...mishnaDoc.next,
        lineNumber: mishnaDoc.next.lineFrom,
      };
    } else return null;
  }
}

export function getPrevious(
  tractate: string,
  chapter: string,
  mishna: string,
  lineNumber: string,
  mishnaDoc: iMishnaForNavigation | null
): iLink | null {
  if (!mishnaDoc?.previous) {
    return null;
  }
  if (!lineNumber) {
    return mishnaDoc.previous;
  }
  if (!mishnaDoc) {
    return null;
  }

  // if first line return
  if (lineNumber === '00001' && chapter === '001') {
    return {
      tractate,
      chapter,
      mishna,
      lineNumber,
    };
  }
  // if can move one line before
  let previousLine = numeral(parseInt(lineNumber) - 1).format('00000');
  const lineObj = mishnaDoc?.lines?.find((lineItem) => lineItem.lineNumber === previousLine);
  if (lineObj) {
    return {
      tractate,
      chapter,
      mishna,
      lineNumber: previousLine,
    };
  }
  // else need to move mishna before
  else if (mishnaDoc.previous) {
    return {
      ...mishnaDoc.previous,
      lineNumber: mishnaDoc.previous.lineTo,
    };
  }
  return null;
}

export const hebrewMap = new Map([
  ['all', 'כל הפרק'],
  ['001', 'א'],
  ['002', 'ב'],
  ['003', 'ג'],
  ['004', 'ד'],
  ['005', 'ה'],
  ['006', 'ו'],
  ['007', 'ז'],
  ['008', 'ח'],
  ['009', 'ט'],
  ['010', 'י'],
  ['011', 'יא'],
  ['012', 'יב'],
  ['013', 'יג'],
  ['014', 'יד'],
  ['015', 'טו'],
  ['016', 'טז'],
  ['017', 'יז'],
  ['018', 'יח'],
  ['019', 'יט'],
  ['020', 'כ'],
  ['021', 'כא'],
  ['022', 'כב'],
  ['023', 'כג'],
]);
