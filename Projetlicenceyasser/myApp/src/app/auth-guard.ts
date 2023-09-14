import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { appConfig } from './app.config';

@Injectable({
    providedIn: 'root'
})


export class AuthGuard implements CanActivate {
    constructor(private navController: NavController, private router: Router) { }

    token: any;
    canActivate() {
        this.token = localStorage.getItem('token');
        if (this.token) {
            console.log(this.token);
            return true;
        }
        else {
             this.router.navigate(['auth']);
        }
    }
}