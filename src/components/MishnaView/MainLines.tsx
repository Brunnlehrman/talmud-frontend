import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MainLine from "./MainLine";
import { iLine } from "../../types/types";
import SugiaButton from "./SugiaButton";
import { useHistory, useParams } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { routeObject } from "../../routes/AdminRoutes";
import { connect } from "react-redux";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  lineNumber: {
    //@ts-ignore
    ...theme.typography.lineNumber,
  },
  sourceReference: {
    //@ts-ignore
    ...theme.typography.sourceReference,
  },
  lines: {
    position: 'relative'
  },
  adminButton: {
    position: "absolute",
    left: '-3rem',
    top: '-1rem'
  },
}));

const mapStateToProps = (state: any) => ({
  username: state.authentication.username,
});

interface Props {
  lines: iLine[];
  username: any;
}
const MainLines = (props: Props) => {
  const classes = useStyles();
  const { lines, username } = props;
  let sectionsIndex = 1;

  const history = useHistory();
  const route = useParams<routeObject>();
  if (!lines) {
    return null;
  }

  return (
    <div className={classes.root}>
      {lines.map((line, index) => {
        return (
          <div key={line.lineNumber} className={classes.lines}>
            {username ? (
              <IconButton
                className={classes.adminButton}
                onClick={() => {
                  const url = `/admin/edit/${route.tractate}/${route.chapter}/${route.mishna}/${line.lineNumber}/`;
                  //@ts-ignore
                  window!.open(url, '_blank').focus();
                }}
              >
                <Edit></Edit>
              </IconButton>
            ) : null}
            {line.sugiaName ? (
              <SugiaButton index={sectionsIndex++} line={line} />
            ) : null}
            <MainLine lineIndex={index} line={line} />
          </div>
        );
      })}
    </div>
  );
};

export default connect(mapStateToProps)(MainLines);
