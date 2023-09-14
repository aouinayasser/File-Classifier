import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit  {
    login: FormGroup;
    data: any;

    constructor(private router: Router, public toastController: ToastController, private userserv: UserService, private store: Store, private navController: NavController, private platform: Platform) {}

    async presentToastWithOptions(color, popmsg) {
        const toast = await this.toastController.create({
            header: 'Login',
            message: popmsg,
            position: 'bottom',
            color: color,
            buttons: [
                {
                    text: 'Done',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        await toast.present();
    }

    color: any;
    popmsg: any;
    token: any;

  onLogin() {
      console.log(this.login.value.email);
      this.userserv.loginUser(this.login.value).subscribe(res => {
          this.data = res;
          console.log(res);
          if (this.data.status == 1) {
              this.token = this.data.data.token;
              localStorage.setItem('token', this.token);
              localStorage.setItem('email', this.login.value.email);
              this.router.navigate(['']);
              this.color = 'success';
              this.popmsg = this.data.message;
              this.presentToastWithOptions(this.color, this.popmsg);
              this.login.reset();
          }

          if (this.data.status == 0) {
              this.router.navigate(['auth']);
              this.color = 'danger';
              this.popmsg = this.data.message;
              this.presentToastWithOptions(this.color, this.popmsg);
          }
      });
  }


  ngOnInit(): void {
    this.login = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(150)]),
    });
  }
}
