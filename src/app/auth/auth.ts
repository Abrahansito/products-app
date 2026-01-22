import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

//Interfaces según el backend
export interface User {
  id?: string;
  full_name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  role: string;
  username?: string;
  user?: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  //Usamos la variable de entorno
  private apiUrl = `${environment.apiUrl}/auth`;

  //Estado del usuario actual
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadSession();
  }

  //Cargar sesión si refrescan la página
  private loadSession() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('user_name'); //Guardamos el nombre para mostrarlo

    if (token && role) {
      //Reconstruimos un usuario básico basado en lo que tenemos guardado
      this.currentUserSubject.next({
        full_name: name || 'Usuario',
        email: '',
        role: role
      });
    }
  }

  //LOGIN
  login(credentials: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.access_token) {
          //Guardar datos
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('role', response.role);

          if (response.username) {
            localStorage.setItem('user_name', response.username);
          }

          //Actualizar estado en la app
          this.currentUserSubject.next({
            full_name: response.username || 'Usuario',
            email: credentials.email,
            role: response.role
          });
        }
      })
    );
  }

  //REGISTRO
  register(data: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
    //El registro no loguea automáticamente, solo crea la cuenta.
  }

  //LOGOUT
  logout() {
    localStorage.clear(); //Borra todo (token, role, user)
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  //Getters
  getAllUsers(){
    return this.http.get<any[]>(`${environment.apiUrl}/users`);
  }

  updateUser(id: string, data: any) {
    return this.http.patch(`${environment.apiUrl}/users/${id}`, data);
  }

  deleteUser(id: string) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
}
