import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UserAuthService {
  constructor() {}

  public setRoles(roles: []) {
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  public getRoles(): [] {
    return JSON.parse(localStorage.getItem("roles")!);
  }

  public setToken(token: string) {
    localStorage.setItem("token", token);
  }

  public getToken(): string {
    return localStorage.getItem("token")!;
  }

  public removeToken() {
    localStorage.removeItem("token");
  }

  public setUserId(userId: number) {
    localStorage.setItem("userId", JSON.stringify(userId));
  }

  public getUserId() {
    return JSON.parse(localStorage.getItem("userId")!);
  }

  public setName(username: string) {
    localStorage.setItem("username", JSON.stringify(username));
  }

  public getName() {
    return JSON.parse(localStorage.getItem("username")!);
  }

  public clear() {
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }
}
