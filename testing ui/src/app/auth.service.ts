import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get(ApiService.API.GET_API_WORK);
  }

  userLogin(data) {
    console.log(data);
    return this.http.post<any>(ApiService.API.LOGIN, data);
  }


  getUserId() {
    return sessionStorage.getItem('id');
  }

  getUserRole() {
    return sessionStorage.getItem('role');
  }

  validateUser(data) {
    return this.http.post(ApiService.API.VALIDATE_USER, data);
  }

  getAllUsers() {
    return this.http.get(ApiService.API.GET_USERS_LIST);
  }

  
 

  userLogout(data) {
    return this.http.post(ApiService.API.USER_LOGOUT, data);
  }

}
