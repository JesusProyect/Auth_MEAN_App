import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario() {
    return { ...this._usuario };
  }

  constructor( private http: HttpClient ) { }

  registro( name: string, email: string, password: string ){
    const body = { name, email, password };

      return this.http.post<AuthResponse>( `${this.baseUrl}/auth/new`, body )
        .pipe(
          tap( resp => {
            if( resp.ok === true ){
              localStorage.setItem('token' , resp.token!);
             
            }
          }),
          map( resp => resp.ok  ),
          catchError( error => of( error.error.msg ))
        );
  }

  login( email: string, password: string  ){
    
    const url  = `${this.baseUrl}/auth/login`;
    const body = { email , password }
    
    return this.http.post<AuthResponse>( url  , body )
      .pipe(
        tap( ({ ok, token }) => {
          if( ok ){
            localStorage.setItem('token', token!);
          }
        }),
        map( resp => resp.ok ),
        catchError( err => of( err.error.msg ) )
      );
  
  }

  validarToken(){
    const url =  `${this.baseUrl}/auth/renew`;

    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token')  || '' );
 
    return this.http.get<AuthResponse>( url, { headers } )
      .pipe(
        map( resp => {
          
          localStorage.setItem('token', resp.token!);
          this._usuario = {
            name : resp.name!,
            uid : resp.uid!,
            email: resp.email!
          }  
          return resp.ok;
        }),
        catchError( error => of(false) )
      );
  }

  logout(){
    //si quisieramos purgar todo
    // localStorage.clear()A;
    localStorage.removeItem('token');

  }

}
