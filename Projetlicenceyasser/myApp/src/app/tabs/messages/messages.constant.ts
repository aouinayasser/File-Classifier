import { environment } from '../../../environments/environment';

export const apiGetAllMessages = (search = '', page = 1, limit = 10) =>
  `${environment.api}/${environment.apiVersion}/messages?search=${search}&page=${page}&limit=${limit}`;
