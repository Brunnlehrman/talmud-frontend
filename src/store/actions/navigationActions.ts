import { RootState } from '..';
import PageService from '../../services/pageService';
import SettingsService from '../../services/settingsServince';
import { iMishna } from '../../types/types';
import { UserGroup } from '../reducers/authReducer';
import { tryAsyncWithLoadingState } from './actionHelpers';
import { getPrivateComments } from './commentsActions';
import { setManuscriptsForChapter } from './relatedActions';

export const REQUEST_START = 'REQUEST_START';
export const REQUEST_COMPOSITIONS = 'REQUEST_COMPOSITIONS';
export const RECEIVE_COMPOSITIONS = 'RECEIVE_COMPOSITIONS';
export const RECEIVE_TRACTATES = 'RECEIVE_TRACTATES';
export const REQUEST_TRACTATES = 'REQUEST_TRACTATES';
export const REQUEST_MISHNA = 'REQUEST_MISHNA';
export const RECEIVE_MISHNA = 'RECEIVE_MISHNA';
export const SET_CURRENT_TRACTATE = 'SET_CURRENT_TRACTATE';
export const RECEIVED_CURRENT_LOCATION = 'RECEIVED_CURRENT_LOCATION';
export const RECEIVED_CURRENT_SELECTION = 'RECEIVED_CURRENT_SELECTION';
export const SET_SELECTED_FOR_ROUTE = 'SET_SELECTED_FOR_ROUTE';
export const SET_ROUTE = 'SET_ROUTE';
export const SELECT_TRACTATE = 'SELECT_TRACTATE';
export const SELECT_CHAPTER = 'SELECT_CHAPTER';
export const SELECT_MISHNA = 'SELECT_MISHNA';
export const SELECT_LINE = 'SELECT_LINE';
export const SET_CURRENT_MISHNA = 'SET_CURRENT_MISHNA';
export const SET_CURRENT_ROUTE = 'SET_CURRENT_ROUTE';

export const startRequest = () => ({
  type: REQUEST_START,
});

export const receivedCompositions = (compositions) => ({
  type: RECEIVE_COMPOSITIONS,
  compositions,
});
export const receivedTractates = (tractates) => ({
  type: RECEIVE_TRACTATES,
  tractates,
});

export const receivedMishna = (currentMishna) => ({
  type: RECEIVE_MISHNA,
  currentMishna,
});

export const receivedCurrentLocation = (currentTractate, currentChapter, currentMishna, currentLine) => ({
  type: RECEIVED_CURRENT_LOCATION,
  currentTractate,
  currentChapter,
  currentMishna,
  currentLine,
});

export const receivedCurrentSelection = (tractateData, chapterData, mishnaData, lineData) => ({
  type: RECEIVED_CURRENT_SELECTION,
  selectedTractateData: tractateData,
  selectedChapterData: chapterData,
  selectedMishnaData: mishnaData,
  selectedLineData: lineData,
});

export const setRoute = (tractate, chapter, mishna, line) => {
  return function (dispatch) {
    dispatch({ type: SET_ROUTE, tractate, chapter, mishna, line });
    dispatch(setManuscriptsForChapter(tractate, chapter));
  };
};

export const setSelectedForRoute = (selectedTractate, selectedChapter, selectedMishna, selectedLine) => ({
  type: SET_SELECTED_FOR_ROUTE,
  selectedTractate,
  selectedChapter,
  selectedMishna,
  selectedLine,
});

export const setCurrentMishna = (mishnaDoc) => {
  return {
    type: SET_CURRENT_MISHNA,
    currentMishna: mishnaDoc,
  };
};

export const setCurrentRoute = (currentTractate, currentChapter, currentMishna, currentLine = null) => ({
  type: SET_CURRENT_ROUTE,
  currentTractate,
  currentChapter,
  currentMishna,
  currentLine,
});

export function getCurrentTractate() {
  return function (dispatch) {
    dispatch(requestTractates());
  };
}

export function getMishna(tractate: string, chapter: string, mishna: string) {
  return async function (dispatch, getState) {
    let mishnaData = await tryAsyncWithLoadingState(dispatch, PageService.getMishna(tractate, chapter, mishna));
    if (mishnaData) {
      dispatch(setCurrentMishna(mishnaData));
      const isAuthenticated = getState().authentication.userGroup !== UserGroup.Unauthenticated;
      isAuthenticated && dispatch(getPrivateComments());
    }
  };
}
export function setNavigationToRoute(tractate: string, chapter: string, mishna: string, line: string) {
  return async function (dispatch, getState) {
    let state = getState();

    if (state.navigation.tractates.length === 0) {
      await dispatch(requestTractates());
      state = getState();
    }
    let mishnaData;
    let lineData;
    if (state.navigation.currentMishna?.id !== mishna) {
      mishnaData = await PageService.getMishna(tractate, chapter, mishna);
    }
    if (line !== undefined) {
      lineData = mishnaData.lines.find((l) => l.lineNumber === line);
      // if (lineData === undefined) {
      //   lineData = mishnaData.lines[0];
      // }
    }

    const tractateData = state.navigation.tractates.find((t) => t.id === tractate);
    const chapterData = tractateData?.chapters.find((c) => c.id === chapter);
    dispatch(setSelectedForRoute(tractateData, chapterData, mishnaData, lineData));
    dispatch(setCurrentRoute(tractateData, chapterData, mishnaData));
    dispatch(setCurrentMishna(mishnaData));
  };
}

export function selectTractate(selectedTractate) {
  return async function (dispatch, getState) {
    dispatch({
      type: SELECT_TRACTATE,
      selectedTractate,
    });
    dispatch(selectChapter(selectedTractate?.chapters[0]));
  };
}

export function selectChapter(selectedChapter) {
  return async function (dispatch, getState) {
    dispatch({
      type: SELECT_CHAPTER,
      selectedChapter,
    });
    dispatch(selectMishna(selectedChapter?.mishnaiot[0]));
  };
}

export function selectMishna(selectedMishna) {
  return async function (dispatch, getState) {
    if (!selectedMishna) {
      return;
    }
    let state = getState();
    if (state.navigation.selectedLine) {
      if (!selectedMishna?.lines) {
        selectedMishna = await PageService.getMishna(
          state.navigation.selectedTractate.id,
          state.navigation.selectedChapter.id,
          selectedMishna.mishna
        );
      }
      const firstLine = selectedMishna?.lines[0];
      dispatch({
        type: SELECT_MISHNA,
        selectedMishna,
        selectedLine: firstLine,
      });
    } else {
      dispatch({
        type: SELECT_MISHNA,
        selectedMishna,
      });
    }
  };
}

export function selectLine(selectedLine) {
  return async function (dispatch, getState) {
    dispatch({
      type: SELECT_LINE,
      selectedLine,
    });
  };
}

export function requestCompositions() {
  return function (dispatch) {
    dispatch(startRequest());
    return SettingsService.getSettings('compositions').then(
      (response) => dispatch(receivedCompositions(response)),
      (error) => console.log('An error occurred.', error)
    );
  };
}

export function requestMishna(tractate, chapter, mishna) {
  return function (dispatch) {
    dispatch(startRequest());
    return PageService.getMishnaEdit(tractate, chapter, mishna).then(
      //@ts-ignore
      (data) => dispatch(receivedMishna(data.data)),
      (error) => console.log('An error occurred.', error)
    );
  };
}

export function setCurrentLocation(type = 'location', tractate: string, chapter: string, mishna: string, line: string) {
  return async (dispatch, getState) => {
    dispatch(startRequest());
    let state: RootState = getState();
    if (state.navigation.tractates.length === 0) {
      await dispatch(requestTractates());
    }
    state = getState() as RootState;
    const tractateData = state.navigation.tractates.find((t) => t.id === tractate);
    const chapterData = tractateData?.chapters.find((c) => c.id === chapter);
    const foundMishna = chapterData.mishnaiot.find((m) => m.mishna === mishna);
    let mishnaData: iMishna | null = null;
    let lineData;
    // instead found mishna
    if (foundMishna && state.navigation.currentMishna.id === foundMishna.id) {
      mishnaData = state.navigation.currentMishna as iMishna;
      lineData = mishnaData.lines.find((l) => l.lineNumber === line);
      if (lineData === undefined) {
        lineData = mishnaData.lines[0];
      }
    } else {
      mishnaData = await tryAsyncWithLoadingState(dispatch, PageService.getMishna(tractate, chapter, '001'));
      if (mishnaData) {
        lineData = mishnaData.lines[0];
      }
    }
    if (type === 'location') {
      dispatch(receivedCurrentLocation(tractateData, chapterData, mishnaData, lineData));
    }
    if (type === 'selection') {
      dispatch(receivedCurrentSelection(tractateData, chapterData, mishnaData, lineData));
    }
    state = getState();
  };
}

export function requestTractates() {
  return function (dispatch) {
    dispatch(startRequest());
    return PageService.getAllTractates().then(
      (tractates) => dispatch(receivedTractates(tractates)),
      (error) => console.log('An error occurred.', error)
    );
  };
}
