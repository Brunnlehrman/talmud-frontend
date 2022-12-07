import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { iManuscript, iManuscriptPopup } from '../../types/types';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { setManuscriptsForChapter, setSublineData } from '../../store/actions/relatedActions';
import ZoomImage from '../manuscripts/ZoomImage';
import { getImageUrl } from '../../inc/manuscriptUtils';

const sx = {
  root: {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '4px',
    width: '50%',
    height: '70%',
    p: 1,
  },
};

const mapStateToProps = (state) => ({
  sublineData: state.related.sublineData,
  currentRoute: state.navigation.currentRoute,
  manuscriptsForChapter: state.related.manuscriptsForChapter,
});

const mapDispatchToProps = (dispatch) => ({
  closeManuscriptPopup: () => {
    dispatch(setSublineData(null));
  },
  setManuscriptsForChapter: (chapter: string, tractate: string) => {
    dispatch(setManuscriptsForChapter(chapter, tractate));
  },
});

export interface iProps {
  sublineData: iManuscriptPopup;
  currentRoute: any;
  closeManuscriptPopup: () => void;
  setManuscriptsForChapter: (chapter: string, tractate: string) => void;
  manuscriptsForChapter: iManuscript[];
}

const ManuscriptPopup = (props: iProps) => {
  const { sublineData, closeManuscriptPopup, currentRoute, setManuscriptsForChapter, manuscriptsForChapter } = props;
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    setImageURL(getImageUrl(manuscriptsForChapter, sublineData));
  }, [sublineData?.subline.index, sublineData?.line]);

  useEffect(() => {
    setManuscriptsForChapter(currentRoute?.tractate, currentRoute?.chapter);
  }, [currentRoute?.chapter, currentRoute?.tractate]);

  return (
    <Modal
      sx={{
        border: 'none',
      }}
      open={Boolean(sublineData)}
      onClose={closeManuscriptPopup}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={sx.root}>
        File name - {imageURL}
        <br />
        שורה - {sublineData?.subline.index}
        <br />
        טקסט שורה - {sublineData?.subline.text}
        <Box style={{ border: '10px solid #080865', height: '30rem', boxShadow: '0px 7px 13px 0px #010122' }}>
          <ZoomImage image={imageURL} />
        </Box>
      </Box>
    </Modal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ManuscriptPopup);
