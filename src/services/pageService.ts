import { RawDraftContentState } from 'draft-js';
import { iMishna, iTractate } from '../types/types';
import axiosInstance from './api';

export interface RichTextsMishnas {
  mishna: string;
  richTextMishna: RawDraftContentState;
}

interface getChapterReponse {
  totalMishnaiot: number;
  mishnaDocument: iMishna;
  richTextsMishnas?: RichTextsMishnas[];
}

export default class PageService {
  static async getPage(tractate, chapter, mishna) {
    const url = `/mishna/${tractate}/${chapter}/${mishna}`;
    const s = await axiosInstance.get(url);
    return s;
  }
  static async getTractate(tractate) {
    const url = `/mishna/${tractate}`;
    const response = await axiosInstance.get(url);
    return response.data;
  }

  static async getMishna(tractate: string, chapter: string, mishna: string): Promise<iMishna> {
    const url = `/mishna/${tractate}/${chapter}/${mishna}`;
    const response = await axiosInstance.get(url);
    return response.data;
  }

  static async getChapter(tractate: string, chapter: string, mishna = 1): Promise<getChapterReponse> {
    const url = `/mishna/${tractate}/${chapter}?mishna=${mishna}`;
    const response = await axiosInstance.get(url);
    return response.data;
  }

  static async getMishnaEdit(tractate, chapter, mishna) {
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}`;
    let response;
    try {
      response = await axiosInstance.get(url);
    } catch (e) {
      alert(e);
    }
    return response.data;
  }

  static async getAllTractates(): Promise<iTractate[]> {
    const url = `/tractates`;
    const response = await axiosInstance.get(url);
    return response.data.tractates;
  }

}
