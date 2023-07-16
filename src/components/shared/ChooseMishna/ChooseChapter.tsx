import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { iTractate, refMishna } from '../../../types/types';
import { hebrewMap } from '../../../inc/utils';

export interface leanChapter {
  id: string;
  mishnaiot: refMishna[];
}

interface Props {
  chapter: string;
  inTractate: iTractate | null;
  onSelectChapter: (tractate: leanChapter) => void;
}

const ChooseChapter = (props: Props) => {
  const { chapter, onSelectChapter, inTractate } = props;
  const [selectedChapter, setSelectedChapter] = useState<leanChapter | null>(null);

  const { t } = useTranslation();

  const _onChange = (event: SyntheticEvent<Element, Event>, chapter: leanChapter | null) => {
    if (chapter) {
      onSelectChapter(chapter);
    }
  };

  useEffect(() => {
    const found = inTractate?.chapters.find((c) => c.id === chapter);
    if (found) {
      setSelectedChapter(found);
      onSelectChapter(found);
    }
  }, [inTractate, chapter]);

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
        value={selectedChapter}
        options={inTractate?.chapters || []}
        autoHighlight={true}
        getOptionLabel={(option) => hebrewMap.get(option.id) as string}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => <TextField {...params} label={t('Chapter')} variant="outlined" />}
        ListboxProps={{
          style: {
            direction: 'rtl',
          },
        }}
      />
    </>
  );
};

export default ChooseChapter;
