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
  mishna: string;
  allChapterAllowed?: boolean;
  inChapter: leanChapter | null;
  onSelectMishna: (mishna: iMishnaForNavigation) => void;
}

const ChooseMishna = (props: Props) => {
  const { mishna, onSelectMishna, inChapter, allChapterAllowed } = props;
  const [selectedMishna, setSelectedMishna] = useState<refMishna | null>(null);
  const [mishnaiot, setMishnaiot] = useState<refMishna[] | []>([]);
  const { t } = useTranslation();

  const _onChange = (event: SyntheticEvent<Element, Event>, mishna: refMishna | null) => {
    setSelectedMishna(mishna);
  };

  function parseMishnaId(id: string) {
    const strings = id.split('_');
    return [strings[0], strings[1], strings[2]];
  }

  const fetchLines = (tractate: string, chapter: string, mishna: string) => {
    const controller = new AbortController();
    return NavigationService.getMishnaForNavigation(tractate, chapter, mishna, controller);
  };

  useEffect(() => {
    if (!selectedMishna?.id) {
      return;
    }
    const [tractateName, chapterName, mishnaName] = parseMishnaId(selectedMishna?.id);
    fetchLines(tractateName, chapterName, mishnaName).then((m) => {
      onSelectMishna(m);
    });
  }, [selectedMishna]);

  useEffect(() => {
    if (!selectedMishna) {
      return;
    }
    const [tractateName, chapterName, mishnaName] = parseMishnaId(selectedMishna?.id);
    fetchLines(tractateName, chapterName, mishna).then((m) => {
      setSelectedMishna(m);
      onSelectMishna(m);
    });
  }, [mishna]);

  useEffect(() => {
    const found = inChapter?.mishnaiot.find((m) => m.mishna === mishna);
    setMishnaiot(inChapter?.mishnaiot || []);
    setSelectedMishna(found || null);
  }, [inChapter]);

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
            textAlign: 'right',
          },
        }}
      />
    </>
  );
};

export default ChooseMishna;
