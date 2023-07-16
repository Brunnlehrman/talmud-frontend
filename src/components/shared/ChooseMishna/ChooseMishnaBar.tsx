import React, { useMemo, useState } from 'react';
import { Button, Grid, Box } from '@mui/material';

import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import ChooseMishnaForm from './ChooseMishnaForm';
import { routeObject } from '../../../store/reducers/navigationReducer';
import { iLink } from '../../../types/types';

interface Props {
  allChapterAllowed?: boolean;
  keypressNavigation?: boolean;
  onNavigationUpdated: Function;
  onButtonNavigation?: (nav: iLink) => void;
}

const selectButtonDisabled = () => false;

const ChooseMishnaBar = ({
  allChapterAllowed = false,
  keypressNavigation = false,
  onNavigationUpdated,
  onButtonNavigation = () => {},
}: Props) => {
  const { tractate, chapter, mishna, line } = useParams<routeObject>();
  const [navigation, setNavigation] = useState<iLink>({
    tractate: tractate || '',
    chapter: chapter || '',
    mishna: mishna || '',
    lineNumber: line || '',
  });
  const { t } = useTranslation();

  const handleNavigate = (e) => {
    onNavigationUpdated(navigation);
  };
  const memoizedProps = useMemo(() => {
    const link: iLink = {
      tractate: tractate || '',
      chapter: chapter || '',
      mishna: mishna || '',
      lineNumber: line || '',
    };
    return {
      initValues: link,
    };
  }, [tractate, chapter, mishna, line]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleNavigate(e);
      }}>
      <Grid container>
        <Box sx={{ display: 'flex', flexGrow: 10 }}>
          <ChooseMishnaForm
            allChapterAllowed
            keypressNavigation
            onNavigationUpdated={(newNav) => {
              setNavigation(newNav);
            }}
            onButtonNavigation={onButtonNavigation}
            {...memoizedProps}
          />
        </Box>
        <Box mb={2} sx={{ display: 'flex', flexGrow: 1 }}>
          <Button
            sx={{ width: '100%' }}
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleNavigate}
            disabled={selectButtonDisabled()}>
            {t('Go')}
          </Button>
        </Box>
      </Grid>
    </form>
  );
};

export default ChooseMishnaBar;
