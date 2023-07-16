import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageService from '../../../services/pageService';
import { iTractate } from '../../../types/types';

interface Props {
  tractate: string;
  onSelectTractate: (tractate: iTractate) => void;
}

const ChooseTractate = (props: Props) => {
  const { tractate, onSelectTractate } = props;
  const [selectedTractate, setSelectedTractate] = useState<iTractate | null>(null);
  const [allTractates, setAllTractates] = useState<iTractate[]>([]);

  const { t } = useTranslation();

  const _onChange = (event: SyntheticEvent<Element, Event>, tractate: iTractate | null) => {
    if (tractate) {
      onSelectTractate(tractate);
    }
  };

  useEffect(()=>{
    const found = allTractates.find((t) => t.id === tractate);
    if (found) {
      setSelectedTractate(found);
      onSelectTractate(found);
    }
  }, [tractate]);

  useEffect(() => {
    PageService.getAllTractates().then(
      (tractates) => {
        setAllTractates(tractates);
        const found = tractates.find((t) => t.id === tractate);
        if (found) {
          setSelectedTractate(found);
          onSelectTractate(found);
        }
      },
      (error) => console.log('An error occurred.', error)
    );
  }, []);

  return (
    <Autocomplete
      sx={{
        minWidth: 100,
        flex: 'auto',
        '&.MuiAutocomplete-root  .MuiOutlinedInput-root .MuiAutocomplete-input': {
          padding: 0,
        },
      }}
      onChange={_onChange}
      value={selectedTractate}
      options={allTractates}
      autoHighlight={true}
      getOptionLabel={(option) => option.title_heb}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      renderInput={(params) => <TextField {...params} label={t('Tractate')} variant="outlined" />}
      ListboxProps={{
        style: {
          direction: 'rtl',
        },
      }}
    />
  );
};

export default ChooseTractate;
