import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email?: string;
}

export interface AuthResponse {
  access_token: string;
  user?: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'https://products-api-t9hi.onrender.com';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userStr = localStorage.getItem('user');

    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      localStorage.removeItem('user');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user && user.id && user.username) {
        this.currentUserSubject.next(user);
      } else {
        localStorage.removeItem('user');
      }
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
      localStorage.removeItem('user');
    }
  }

  login(data: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/login`, data).pipe(
      tap(response => {
        if (response && response.access_token) {
          this.saveToken(response.access_token);
        }
        if (response && response.user) {
          this.saveUser(response.user);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  register(data: { username: string; password: string; email?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/register`, data).pipe(
      tap(response => {
        if (response && response.access_token) {
          this.saveToken(response.access_token);
        }
        if (response && response.user) {
          this.saveUser(response.user);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  saveToken(token: string) {
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  saveUser(user: User) {
    if (user && user.id && user.username) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
