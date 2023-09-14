import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  data: any;
  register: FormGroup = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(150)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(150)]),
    },
    { validators: this.passwordConfirmMatchValidator },
  );

    constructor(public toastController: ToastController, private userserv: UserService) {}

    async presentToastWithOptions(color,popmsg) {
        const toast = await this.toastController.create({
            header: 'Registration',
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
    onRegister() {
        
      this.userserv.registerUser(this.register.value).subscribe(res => {
          this.data = res;
          console.log(res);
          if (this.data.status == 1) {
              this.color = 'success';
              this.popmsg = this.data.message;
              this.presentToastWithOptions(this.color,this.popmsg);
              this.register.reset();
          }

          if (this.data.status == 0) {
              this.color = 'danger';
              this.popmsg = this.data.message;
              this.presentToastWithOptions(this.color, this.popmsg);

          }
      });
  }

  ngOnInit(): void {}

  passwordConfirmMatchValidator(g: AbstractControl): ValidationErrors | null {
    const password = g.get('password');
    const passwordConfirm = g.get('passwordConfirm');

    if (passwordConfirm.hasError('required') || passwordConfirm.hasError('minlength')) {
      return;
    }

    if (password.value !== passwordConfirm.value) {
      passwordConfirm.setErrors({
        mismatch: true,
      });
    } else {
      passwordConfirm.setErrors(null);
    }
  }
}
