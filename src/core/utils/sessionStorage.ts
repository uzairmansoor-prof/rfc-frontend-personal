export type sessionType =
  | "token"
  | "user-session"
  | "chat-session"
  | "exported";

export class SessionStorage {
  public static setKey(
    key: sessionType,
    value: any,
    storageMedia: Storage = localStorage,
  ) {
    storageMedia.setItem(key, JSON.stringify(value));
  }

  public static getKey(key: sessionType, storageMedia: Storage = localStorage) {
    const sessionValue = storageMedia.getItem(key);
    try {
      return JSON.parse(sessionValue);
    } catch (error) {
      return sessionValue;
    }
  }
  public static removeKey(
    key: sessionType,
    storageMedia: Storage = localStorage,
  ) {
    storageMedia.removeItem(key);
  }

  public static clearStorage() {
    sessionStorage.clear();
    return localStorage.clear();
  }
}
