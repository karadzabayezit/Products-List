import cryptoJs from 'crypto-js';

const END_OF_DATE = 10;

function getMD5Hash(PASSWORD) {
  const currentDate = new Date().toISOString().slice(0, END_OF_DATE).replace(/-/g, ''); // Date format YYYYMMDD
  const authString = `${PASSWORD}_${currentDate}`;
  const authToken = cryptoJs.MD5(authString);
  return authToken;
}

function removeDuplicates(arr) {
  return arr.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
}

export { getMD5Hash, removeDuplicates };
