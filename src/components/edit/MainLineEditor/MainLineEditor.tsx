import React, { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import { Button, IconButton, makeStyles } from "@material-ui/core";
import {  } from "../../../types/types";
import { ContentState, convertFromRaw, EditorState, Modifier, RawDraftContentState } from "draft-js";
import { CheckCircle, Close, Edit } from "@material-ui/icons";
import CheckboxField from "../../formik/CheckboxField";
import { compoundNosachDecorators } from "../../editors/EditorDecoratorNosach";
import { InitialEntityDialogState, MainLineDialog, NosachEntity } from "./MainLineDialog";
import { getContentStateArray, getFinalText } from "../../../inc/editorUtils";

export interface EditingData {
  editingComment: string|undefined;
  linkTo?: string|undefined;
  oldWord?: string|undefined;
}
interface Props {
  lines: string[],
  onSave: Function;
  fieldName: string;
  content: RawDraftContentState
}

enum MODE {
  EDIT,
  READONLY,
}

const addEntity = (contentState: ContentState, type:string, data = {}) => {
  return contentState.createEntity(type, "IMMUTABLE", {
    ...data
  });
};


const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "1.7rem",
    position: "relative",
    "& .readonly": {
      backgroundColor: theme.palette.grey[500],
    },
    '& .RichEditor-root': {padding:'5px'}
  },
  buttons: {
    position: "absolute",
    top: '-0.6rem',
  },
}));

const MainLineEditor = (props: Props) => {
  const { content, onSave, fieldName } = props;

  const classes = useStyles();

  const [initial, setInitial] = useState(
    EditorState.createEmpty()
  );
  const [editor, setEditor] = useState(
    EditorState.createEmpty()
  );

  const [finalText, setFinalText] = useState<string[]>([])

  const [mode, setMode] = useState(MODE.READONLY);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [initialDialogState, setInitialDialogState] = useState<InitialEntityDialogState>({
    type: NosachEntity.ADD,
    editingData: {editingComment: ''}
  });

  function setEntity(type: string, data = {}){
    let content = editor.getCurrentContent();
    content = addEntity(content,type, data);
    const entityKey = content.getLastCreatedEntityKey();

    content = Modifier.applyEntity(
      content,
      editor.getSelection(),
        entityKey
       );
       let newEditorState = EditorState.createWithContent(
        content,
        compoundNosachDecorators
      );
  
      setEditor(
        newEditorState
      );
      setFinalText(getFinalText(content))

  }
  useEffect(() => {
    let newEditorState;
    if (content) {
      const contentState = convertFromRaw(content);
      newEditorState = EditorState.createWithContent(
        contentState,
        compoundNosachDecorators
      );
      setFinalText(getFinalText(contentState))
    } else {
      newEditorState = EditorState.createWithContent(
        ContentState.createFromText(""),
        compoundNosachDecorators
      );
    } 
    setEditor(
      newEditorState
    );
  }, [content]);


  const getEntity = () :EditingData|undefined => {
    const contentState = editor.getCurrentContent();
    const selection = editor.getSelection();
    const block = contentState.getBlockForKey(selection.getAnchorKey());
    const entityKey = block.getEntityAt(selection.getStartOffset());
    if (!entityKey) {return undefined}
    const entityData = contentState.getEntity(entityKey);
    return entityData ? entityData.getData() : undefined;
  }
  const editorChange = (e) => {
    setEditor(e);
  };
  const btnSaveHandler = () => {
    setMode(MODE.READONLY); 
    const content = editor.getCurrentContent();
    const lines = getFinalText(content)
    const newContent = getContentStateArray(content)
    setFinalText(lines)
    onSave(newContent, lines)
  };
  const btnDeleteHandler = () => {
    const entity = getEntity();
    setInitialDialogState({
      type: NosachEntity.DELETE,
      editingData: {
        editingComment: entity?.editingComment ? entity.editingComment : ''}
    }); 
    setDialogOpen(true)
  };
  const btnAddHandler = () => {
    const entity = getEntity();
    setInitialDialogState({
      type: NosachEntity.ADD,
      editingData: {
      editingComment: entity?.editingComment ? entity.editingComment : ''}
    }); 
    setDialogOpen(true)
  };
  const btnQuoteHandler = () => {
    const entity = getEntity();
    setInitialDialogState({
      type: NosachEntity.QUOTE,
      editingData: {
        editingComment: entity?.editingComment ? entity.editingComment : '',
        linkTo: entity?.linkTo ? entity.linkTo : ''
      }
     
    }); 
    setDialogOpen(true)
  };
  const btnCorrectionHandler = () => {
    const entity = getEntity();
    setInitialDialogState({
      type: NosachEntity.CORRECTION,
      editingData: {
        editingComment: entity?.editingComment ? entity.editingComment : '',
        oldWord: entity?.oldWord ? entity.oldWord : ''
      }
    }); 
    setDialogOpen(true)
  };
  const btnCancelHandler = () => {
    setEditor(initial);
    setMode(MODE.READONLY);  
  };

  const btnEditHandler = () => {
    setInitial(editor);
    setMode(MODE.EDIT);
  };

  const onSaveEntity = (type, editingData: EditingData)=>{
      setEntity(type, {
        editingComment: editingData.editingComment,
        linkTo: editingData.linkTo,
        oldWord: editingData.oldWord
      });
      setDialogOpen(false)
  }

  return (
    <>
      <div
        className={`${classes.root} ${
          mode === MODE.READONLY ? "readonly" : ""
        }`}
      >
        <div className={classes.buttons}>
          <IconButton
            size="small"
            onClick={btnEditHandler}
            disabled={mode === MODE.EDIT}
            color="primary"
            aria-label="edit"
          >
            <Edit />
          </IconButton>
          {mode === MODE.EDIT ? (
            <>
              <IconButton
                size="small"
                onClick={btnCancelHandler}
                color="primary"
                aria-label="save"
              >
                <Close />
              </IconButton>
              <IconButton
                size="small"
                onClick={btnSaveHandler}
                color="primary"
                aria-label="save"
              >
                <CheckCircle />
              </IconButton>
              <Button
               size="small"
               onClick={btnDeleteHandler}
               color="primary"
              >
                מחק
              </Button>
              <Button
               size="small"
               onClick={btnAddHandler}
               color="primary"
              >
                הוסף
              </Button>
              <Button
               size="small"
               onClick={btnCorrectionHandler}
               color="primary"
              >
                תיקון
              </Button>
              <Button
               size="small"
               onClick={btnQuoteHandler}
               color="primary"
              >
                ציטוט
              </Button>
            </>
          ) : null}
          <CheckboxField name={fieldName}/>
        </div>
        <MainLineDialog
        initialState={initialDialogState}
        open={dialogOpen}
        onSaveEntity={onSaveEntity}
        onClose={()=>{setDialogOpen(false)}}
      />
        <TextEditor
          readOnly={mode === MODE.READONLY}
          initialState={editor}
          onChange={editorChange}
        />
      </div>
    </>
  );
};

export default MainLineEditor
