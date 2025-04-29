import { atom } from "recoil";

export const sessionStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    if (typeof window !== "undefined") {
      const savedValue = sessionStorage.getItem(key);
      if (savedValue !== null) {
        setSelf(JSON.parse(savedValue));
      }
      onSet((newValue: any, _: any, isReset: any) => {
        if (!newValue) return sessionStorage.setItem(key, JSON.stringify(null));
        const confirm = newValue.length === 0;
        confirm
          ? sessionStorage.removeItem(key)
          : sessionStorage.setItem(key, JSON.stringify(newValue));
      });
    }
  };

// 선택된 메뉴 keys
export const selectedMenuKeysState = atom<string[]>({
  key: "selectedMenuKeysState",
  default: [],
  effects: [sessionStorageEffect("selectedMenuKeysState")],
});
