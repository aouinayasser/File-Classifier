import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UserService {
    apiUrl = 'http://localhost:8000/api';

    constructor(private http: HttpClient) { }

    registerUser(data) {
        return this.http.post(this.apiUrl+'/register/', data);
    }

    loginUser(data) {
        return this.http.post(this.apiUrl + '/login/', data);
    }
}
