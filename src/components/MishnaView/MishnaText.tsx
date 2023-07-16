import { Paper, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { hebrewMap } from '../../inc/utils';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      '&.MuiPaper-root': {
        //@ts-ignore
        //  ...theme.panels.standard,
      },
      '&.MuiPaper-root div': {
        //@ts-ignore
        ...theme.custom.smallTitle,
      },
      //  marginBottom: '1rem',
      fontWeight: 'bold',
      fontSize: '0.8rem',
      color: '#795548',
      // marginRight: '2rem',
    },
  };
});

const MishnaText = (props) => {
  const { html, mishna } = props;
  const mishnaTitle = mishna ? `[משנה ${hebrewMap.get(mishna)}]` : null;

  const classes = useStyles();
  return (
    <Paper elevation={0} className={classes.root}>
      <Typography variant="h6" style={{ fontSize: '1rem' }}>
        {mishnaTitle}
      </Typography>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </Paper>
  );
};

export default MishnaText;
