import { notification } from "antd";
import { signOut } from "next-auth/react";
import { API_VERSION, SERVER_API_URL } from "../utils/global";
/**
 * HTTP 응답 상태 코드 정의
 */
export const HTTP_RESPONSE_STATUS_CODE = {
  /* HTTP 표준 상태 코드  */
  OK: 200, // 요청이 성공적으로 처리되었습니다.
  BAD_REQUEST: 400, // 서버가 요청을 이해하지 못했거나, 클라이언트 측의 잘못된 요청입니다.
  UNAUTHORIZED: 401, // 인증되지 않은 사용자가 보호된 리소스에 접근하려고 합니다. 보통 로그인 필요. (인증 실패)
  FORBIDDEN: 403, // 인증은 되었지만, 요청한 리소스에 대한 권한이 없습니다. (인가 실패)
  NOT_FOUND: 404, // 서버가 요청한 리소스를 찾을 수 없습니다.
  SERVER_ERROR: 500, // 서버 내에서 예기치 못한 오류가 발생했습니다.
};

interface RequestExpansionInit extends RequestInit {
  tokenValidationForce?: boolean;
  timeout?: number;
}

/**
 * 토큰 가져오기
 * CSR
 * @param name
 * @returns
 */
export function getCookie(name: string): string | null {
  const nameLenPlus = name.length + 1;
  const value =
    document.cookie
      .split(";")
      .map((c) => c.trim())
      .filter((cookie) => {
        return cookie.substring(0, nameLenPlus) === `${name}=`;
      })
      .map((cookie) => {
        return decodeURIComponent(cookie.substring(nameLenPlus));
      })[0] || null;
  return value;
}

/**
 * 쿠키 저장
 * CSR
 * @param name
 * @param value
 * @param options
 */
export function setCookie(name: string, value: string, options: any = {}) {
  if (typeof window !== "undefined") {
    options = {
      path: "/",
      ...options,
    };

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookie =
      encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }

    document.cookie = updatedCookie;
  }
}

/**
 * 쿠키 제거
 * CSR
 * @param name
 */
export function deleteCookie(name: string) {
  setCookie(name, "", {
    "max-age": -1, // 쿠키 즉시 만료
  });
}

/**
 * fetch 사용 시 타임아웃 설정
 *
 * @param {RequestInfo | URL} url Fetch URL
 * @param {RequestExpansionInit} options Fetch Options
 */
async function fetchWithTimeout(
  url: RequestInfo | URL,
  options: RequestExpansionInit
) {
  const { timeout = 15000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
}

/**
 * 토큰 재발급
 * @returns accessToken
 */
async function refreshToken() {
  // 1. updateToken API 호출
  try {
    const response = await fetch(
      `${SERVER_API_URL}/${API_VERSION}/auth/refresh`,
      {
        method: "PUT",
        credentials: "include",
      }
    );
    const res = await response.json();

    // 2. 재발급 성공 시, 기존 요청에 새로운 accessToken 전달
    if (res.status === 200) {
      // 2-1. 새로운 Access 토큰 쿠키 저장
      setCookie("accessToken", res?.result?.token?.accessToken);

      return res?.result?.token?.accessToken;
    } else {
      console.error("Failed to refresh token", res);
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token", error);
    return null;
  }
}

/**
 * Customizing fecth
 * @param url
 * @param init
 * @returns
 */
export async function FETCH(url: string, init?: RequestExpansionInit) {
  let tokenData: any = "";
  if (typeof window !== "undefined") {
    tokenData = {
      accessToken: {
        value: getCookie("accessToken"),
      },
    };
  }

  const options: RequestExpansionInit = {
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    cache: "no-cache",
    ...init,
  };

  if (tokenData?.accessToken?.value) {
    if (options.headers != null) {
      // @ts-ignore
      options.headers.Authorization = `Bearer ${tokenData?.accessToken?.value}`;
    }
  }

  if (typeof window.isAlertShown === "undefined") {
    window.isAlertShown = false;
  }

  try {
    // 1. 토큰 체크 후 만료 시 재발급
    const response = await fetchWithTimeout(url, options);
    if (
      response?.status === 401 ||
      response.status === 403 ||
      response.status === 904
    ) {
      // accessToken이 만료된 경우, 토큰을 갱신하고 기존 요청을 다시 시도
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        // 기존 요청을 다시 시도
        // @ts-ignore
        options.headers.Authorization = `Bearer ${newAccessToken}`;
        return await fetchWithTimeout(url, options);
      } else {
        // 토큰 갱신 실패 시 로그아웃 처리
        if (!window.isAlertShown) {
          window.isAlertShown = true;
          ALERT("로그인 정보가 유효하지 않습니다. 다시 로그인 하십시오.");
        }
        signOut({
          callbackUrl: `${window.location.origin}`,
        });
      }
    } else {
      return response;
    }
  } catch (error) {
    throw error;
  }
}

/** With Ant Design Component **/

/**
 * Customizing ALERT (With Antd Notification)
 * @param text
 * @param width
 */
export function ALERT(text: string, width = 500) {
  if (typeof window !== "undefined") {
    notification?.info({
      message: text,
      placement: "top",
      style: {
        fontFamily: "Pretendard-Medium",
      },
    });
  } else {
  }
}
