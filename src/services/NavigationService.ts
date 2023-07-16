import { iMishnaForNavigation } from '../components/shared/ChooseMishna/ChooseMishna';
import axiosInstance from './api';

export default class NavigationService {
  static async getMishnaForNavigation(
    tractate,
    chapter,
    mishna,
    controller: AbortController
  ): Promise<iMishnaForNavigation> {
    const url = `/navigation/${tractate}/${chapter}/${mishna}`;
    const response = await axiosInstance.get(url, {
      signal: controller.signal,
    });
    return response.data;
  }
}
