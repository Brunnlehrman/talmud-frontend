import { RawDraftContentState } from "draft-js";

export interface iSource {
  id: string;
  type: string;
  code: string;
  name: string;
  button_code: string;
}

export interface EditedText {
  simpleText: string;
  content: RawDraftContentState;
}

export interface iSynopsis {
  text: EditedText;
  type: string;
  name: string;
  id: string;
  code: string;
  button_code: string;
  manuscript?: string;
}

export interface iSubline {
  text: string;
  index: number;
  synopsis: iSynopsis[];
}

export interface iLine {
  text: string;
  originalLineNumber?: string;
  lineNumber?: string;
  sourceReference?: string;
  mainLine: string;
  sublines?: iSubline[];
}
