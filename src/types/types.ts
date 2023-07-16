import { RawDraftContentState } from 'draft-js';
import { EditorSelectionObject } from '../inc/editorUtils';
import { iExcerptType } from '../inc/excerptUtils';

export interface iTractate {
  id: string;
  title_heb: string;
  chapters: iChapter[];
}
export interface iChapter {
  id: string;
  mishnaiot: refMishna[];
}

export type refMishna = Pick<iMishna, 'id' | 'mishna'>;
export interface iMishna {
  id: string;
  mishna: string;
  lines: iLine[];
  excerpts: iExcerpt[];
  richTextMishna: RawDraftContentState | null;
  previous?: iMarker;
  next?: iMarker;
  tractate: string;
}

export interface iMarker {
  tractate: string;
  chapter: string;
  mishna: string;
  lineFrom: string;
  lineTo: string;
}

export enum CompositionType {
  PARALLEL = 'parallel',
  EXCERPT = 'excerpt',
  YALKUT = 'yalkut',
}
export interface iSource {
  title: string;
  secondary_title: string;
  date: string;
  type: CompositionType;
  region: string;
  author: string;
  edition?: string;
}

export interface iExcerpt {
  key: number;
  automaticImport: boolean;
  editorStateFullQuote: RawDraftContentState;
  editorStateComments: RawDraftContentState;
  editorStateShortQuote: RawDraftContentState;
  synopsis: string;
  selection: EditorSelectionObject | null;
  type: iExcerptType;
  seeReference: boolean;
  source: iSource | null;
  sourceLocation?: string;
  flagNeedUpdate?: boolean;
  link?: string;
  short?: string;
}

export interface EditedText {
  simpleText: string;
  content?: RawDraftContentState;
  editor?: any; // maybe can be removed
}
export enum SourceType {
  DIRECT_SOURCES = 'direct_sources',
  INDIRECT_SOURCES = 'indirect_sources',
  TRANSLATION = 'translation',
}

export type sourceType = SourceType.DIRECT_SOURCES | SourceType.INDIRECT_SOURCES | SourceType.TRANSLATION;

export interface iSynopsis {
  text: EditedText;
  type: sourceType;
  name: string;
  id: string;
  code: string;
  button_code: string;
  manuscript?: string;
  composition?: iSynopsisComposition;
  location?: string;
}

interface iSynopsisComposition {
  composition: iSource;
  compositionLocation: string;
}

export interface iSubline {
  text: string;
  nosach: RawDraftContentState | null;
  index: number;
  synopsis: iSynopsis[];
  piska?: boolean;
  sugiaName?: string;
  offset?: number;
}

export interface iLine {
  text: string;
  originalLineNumber?: string;
  lineNumber?: string;
  sourceReference?: string;
  mainLine: string;
  sublines?: iSubline[];
  parallels?: iInternalLink[];
}

export interface iManuscript {
  slug: string;
  imageurl: string;
  thumbnail: string;
  pageid: string;
  fromSubline: number;
  toSubline: number;
  fromLine: number;
  toLine: number;
  anchorexpanded: string | null;
  anchorref: string | null;
}

export interface iManuscriptPopup {
  line: number;
  subline: iSubline;
  synopsisCode: string;
  imageUrl?: string;
}

export interface iLink {
  tractate: string;
  chapter: string;
  mishna: string;
  lineNumber?: string;
}
export interface iInternalLink extends iLink {
  linkText: string;
}

export interface iComment {
  userID?: string;
  commentID: string;
  title: string;
  text: string;
  type: CommentType;
  tractate: string;
  chapter: string;
  mishna: string;
  lineNumber: string;
  fromWord: string;
  toWord: string;
  fromSubline: number;
  toSubline: number;
  lineIndex: number;
}

export type iPostComment = Omit<iComment, 'commentID' | 'fromSubline' | 'toSubline'>;

export interface iUpdateComment extends iPostComment {}

export enum CommentType {
  PRIVATE = 'private',
  MODERATION = 'moderation',
}

export interface iUser {
  _id: string;
  userID: string;
  comments: iComment[];
}

export type iPublicCommentsByTractate = iComment & {
  userID: string;
};
