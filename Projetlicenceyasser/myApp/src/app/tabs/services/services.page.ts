import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonContent, NavController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { take } from 'rxjs/operators';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-services',
  templateUrl: 'services.page.html',
  styleUrls: ['services.page.scss'],
})
export class ServicesPage implements OnInit {
  @ViewChild(IonContent) ionContent: IonContent;

  explores: any[] = [
    { id: 'friends_title', icon: 'people', color: 'danger', link: 'friends' },
    { id: 'communities_title', icon: 'people-circle', color: 'warning', link: 'communities' },
    { id: 'music_title', icon: 'musical-notes', color: 'primary', link: 'music' },
  ];
    form: FormGroup;
    email: any;
  constructor(private docserv: DocumentService, private store: Store, private navController: NavController) {}

  openServicePage(explore) {
    this.navController.navigateForward(explore.link);
  }

    async ngOnInit() {
        this.email = localStorage.getItem('email');
        this.form = new FormGroup({
            name_doc: new FormControl(null, [Validators.required]),
            type_doc: new FormControl(null, [Validators.required]),
            img_doc: new FormControl(null, [Validators.required]),
            txt_doc: new FormControl(null, [Validators.required]),
            email: new FormControl(this.email, [Validators.required])
        });
    }

    async submitDocument() {
        this.docserv
            .addDocument(this.form.value)
            .pipe(take(1))
            .subscribe((document) => {
                this.form.reset();
            });
    }

  ionViewDidEnter() {}

  ionViewDidLeave() {}
}
