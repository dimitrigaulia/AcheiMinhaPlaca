import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;
  private tokenKey = 'access_token';
  private userKey = 'user_info';

  currentUser$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  requestOtp(email: string) {
    return this.http.post(`${this.apiUrl}/otp/request`, { email });
  }

  verifyOtp(email: string, code: string) {
    return this.http.post<any>(`${this.apiUrl}/otp/verify`, { email, code }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.accessToken);
        localStorage.setItem(this.userKey, JSON.stringify(response));
        this.currentUser$.next(response);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser$.next(null);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  private loadUser() {
    const user = localStorage.getItem(this.userKey);
    if (user) {
      this.currentUser$.next(JSON.parse(user));
    }
  }
}
