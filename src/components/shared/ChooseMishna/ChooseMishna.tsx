import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { hebrewMap } from '../../../inc/utils';
import { leanChapter } from './ChooseChapter';
import NavigationService from '../../../services/NavigationService';
import { iMarker, refMishna } from '../../../types/types';
import { leanLine } from './ChooseLine';

export interface iMishnaForNavigation extends refMishna {
  lines: leanLine[];
  previous?: iMarker;
  next?: iMarker;
}

export const ALL_CHAPTER: iMishnaForNavigation = {
  id: 'all',
  mishna: 'all',
  lines: [],
};

interface Props {
  mishnaName: string;
  allChapterAllowed?: boolean;
  inChapter: leanChapter | null;
  onSelectMishna: (mishna: iMishnaForNavigation) => void;
}

const ChooseMishna = (props: Props) => {
  const { mishnaName, onSelectMishna, inChapter, allChapterAllowed } = props;
  const [selectedMishna, setSelectedMishna] = useState<refMishna | null>(null);
  const [mishnaiot, setMishnaiot] = useState<refMishna[] | []>([]);
  const { t } = useTranslation();

  const _onChange = (event: SyntheticEvent<Element, Event>, mishna: refMishna | null) => {
    if (!mishna) {
      return;
    }
    const [tractateName, chapterName, mishnaName] = parseMishnaId(mishna.id);
    fetchLines(tractateName, chapterName, mishnaName).then((m) => {
      onSelectMishna(m);
    });
  };

  function parseMishnaId(id: string) {
    const strings = id.split('_');
    return [strings[0], strings[1], strings[2]];
  }

  const fetchLines = (tractate: string, chapter: string, mishna: string) => {
    if (tractate === ALL_CHAPTER.id) {
      return Promise.resolve(ALL_CHAPTER);
    }
    const controller = new AbortController();
    return NavigationService.getMishnaForNavigation(tractate, chapter, mishna, controller);
  };

  useEffect(() => {
    let mishnaiotOptions = inChapter?.mishnaiot ? [...inChapter?.mishnaiot] : [];
    if (allChapterAllowed) {
      mishnaiotOptions.push(ALL_CHAPTER);
    }
    //1. update options from chapter data
    setMishnaiot(mishnaiotOptions);

    let found = mishnaiotOptions.find((m) => m.mishna === mishnaName);
    if (mishnaName === '' && allChapterAllowed) {
      found = ALL_CHAPTER;
    }
    //2. update selected mishna if found
    if (found) {
      setSelectedMishna(found);

      const [tractateName, chapterName, mishnaName] = parseMishnaId(found.id);
      fetchLines(tractateName, chapterName, mishnaName).then((m) => {
        onSelectMishna(m);
      });
    }
  }, [inChapter, mishnaName]);

  return (
    <>
      <Autocomplete
        sx={{
          minWidth: 100,
          flex: 'auto',
          '&.MuiAutocomplete-root  .MuiOutlinedInput-root .MuiAutocomplete-input': {
            padding: 0,
          },
        }}
        onChange={_onChange}
        value={selectedMishna}
        options={mishnaiot}
        autoHighlight={true}
        getOptionLabel={(option) => hebrewMap.get(option.mishna) as string}
        isOptionEqualToValue={(option, value) => option.mishna === value.mishna}
        renderInput={(params) => <TextField {...params} label={t('Halakha')} variant="outlined" />}
        ListboxProps={{
          style: {
            direction: 'rtl',
          },
        }}
      />
    </>
  );
};

export default ChooseMishna;
