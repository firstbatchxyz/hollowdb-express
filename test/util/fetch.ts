import fetch from 'node-fetch';

/**
 * Generic POST utility for HollowDB micro. Depending on the
 * request, call `response.json()` or `response.text()` to parse
 * the returned body.
 * @param url url
 * @param data body
 * @returns response object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function postData(url: string, data: any) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data),
  });
}

/**
 * GET a key from database.
 * @param url url
 * @param key key
 * @returns response object
 */
export async function getKey(url: string, key: string) {
  return fetch(url + '/get/' + key);
}
