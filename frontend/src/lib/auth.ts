import { jwtDecode } from "jwt-decode";
import { NextRequest } from "next/server";

export class Auth {
  static setToken(token: string) {
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 30}`;
  }

  static removeToken() {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  static getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  }

  static isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp ? decoded.exp < Date.now() / 1000 : true;
    } catch {
      return true;
    }
  }

  static validateToken(request: NextRequest) {
    const token = request.cookies.get("token");
    if (!token?.value) return false;
    return !this.isTokenExpired(token.value);
  }
}
