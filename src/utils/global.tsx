export let SERVER_API_URL = `${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_URL}`;
export let API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;

/**
 * object를 query string으로 변환
 *
 * @param {object} x 변환할 object
 * @param {boolean} isEncode 결과물에 대한 URI Encode 여부
 * @return {string} 변환된 query string
 * @constructor
 */
export function URLParams(
  x: object | undefined,
  isEncode: boolean = true
): string {
  if (!x) return "";

  // @ts-ignore
  let params = new URLSearchParams(x);
  const keysForDelete: Array<string> = [];
  params.forEach((value, key) => {
    if (value.trim() == "" || value == "undefined" || value == "null") {
      keysForDelete.push(key);
    }
  });

  keysForDelete.forEach((key) => {
    params.delete(key);
  });

  if (isEncode) {
    return params.toString();
  } else {
    return decodeURIComponent(params.toString());
  }
}
