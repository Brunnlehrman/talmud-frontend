import * as React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions } from '@mui/material';
import ChooseMishnaForm from '../shared/ChooseMishna/ChooseMishnaForm';
import { iLink } from '../../types/types';

interface Props {
  open: boolean;
  onClose: (link: iLink | null) => void;
}

export default function LinkPopup(props: Props) {
  const { open, onClose } = props;
  const [makbila, setMakbila] = React.useState<iLink | null>(null);

  const handleClose = () => {
    onClose(makbila);
  };

  return (
    <Dialog
      sx={{ direction: 'ltr' }}
      open={open}
      maxWidth={'lg'}
      PaperProps={{
        sx: {
          padding: '1rem',
          width: '70%',
        },
      }}>
      <DialogTitle>בחר מקבילה</DialogTitle>

      <ChooseMishnaForm
        initValues={{
          tractate: '',
          chapter: '',
          mishna: '',
          lineNumber: '00001',
        }}
        allChapterAllowed={false}
        onNavigationUpdated={(e: iLink) => {
          console.log('selected ', e);
          setMakbila(e);
        }}
      />
      <DialogActions>
        <Button
          onClick={() => {
            onClose(null);
          }}>
          בטל
        </Button>
        <Button onClick={handleClose}>בחר</Button>
      </DialogActions>
    </Dialog>
  );
}
