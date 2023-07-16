import { Autocomplete, TextField } from '@mui/material';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { iMishnaForNavigation } from './ChooseMishna';

export interface leanLine {
  lineNumber: string;
  mainLine: string;
}

interface Props {
  lineNumber: string;
  mishnaData: iMishnaForNavigation | null;
  onSelectLine: (line: leanLine) => void;
}

const ChooseLine = (props: Props) => {
  const { mishnaData, lineNumber, onSelectLine } = props;
  const { t } = useTranslation();
  const [selectedLine, setSelectedLine] = useState<leanLine | null>(null);

  const _onChange = (event: SyntheticEvent<Element, Event>, line: leanLine | null) => {
    if (line) {
      onSelectLine(line);
    }
  };

  useEffect(() => {
    const found = mishnaData?.lines.find((l) => l.lineNumber === lineNumber);
    const lineSelected = found || mishnaData?.lines[0] || null;
    setSelectedLine(lineSelected);
    if (lineSelected) {
      onSelectLine(lineSelected);
    }
  }, [mishnaData,lineNumber]);

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
      value={selectedLine}
      options={mishnaData ? mishnaData.lines : []}
      autoHighlight={true}
      getOptionLabel={(option) => option.lineNumber + ' ' + option.mainLine || ''}
      ListboxProps={{
        style: {
          textAlign: 'right',
        },
      }}
      renderInput={(params) => <TextField {...params} label={t('Line')} variant="outlined" />}
    />
  );
};

export default ChooseLine;
