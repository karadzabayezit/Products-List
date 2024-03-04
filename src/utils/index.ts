import cryptoJs from 'crypto-js';
import { IProduct } from '../types';

const END_OF_DATE = 10;

function getMD5Hash(PASSWORD: string) {
  const currentDate = new Date().toISOString().slice(0, END_OF_DATE).replace(/-/g, ''); // Date format must be YYYYMMDD
  const authString = `${PASSWORD}_${currentDate}`;
  const authToken = cryptoJs.MD5(authString);
  return authToken.toString();
}

function removeDuplicates(arr: IProduct[]) {
  return arr.filter((item, index, self) => index === self.findIndex((el: IProduct) => el.id === item.id));
}
const changePageQuery = (query: string, value: number | string) => {
  const { protocol, host, pathname } = location;
  const path = `${host + pathname}`;
  if (history.pushState) {
    const newUrl = `${protocol}//${path}?${query}=${value}`;
    history.pushState({ path: newUrl }, '', newUrl);
  }
};

export { changePageQuery, getMD5Hash, removeDuplicates };
