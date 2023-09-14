import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { Document } from '../tabs/main/main.model';
import { DocumentService } from '../services/document.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
    @Input() docu: Document;
    form: FormGroup;
    constructor(public navCtrl: NavController, private modalCtrl: ModalController, public docserv: DocumentService) { }

    async ngOnInit() {
        this.form = new FormGroup({
            name_doc: new FormControl(null, [Validators.required]),
            type_doc: new FormControl(null, [Validators.required]),
            img_doc: new FormControl(null, [Validators.required]),
            txt_doc: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [Validators.required])
        });

        console.log(this.docu);
        this.setFormValues();
    }

    closeModal(data = null) {
        this.modalCtrl.dismiss(data);
    }

    setFormValues() {
        this.form.setValue({
            name_doc: this.docu.name_doc,
            type_doc: this.docu.type_doc,
            img_doc: this.docu.img_doc,
            txt_doc: this.docu.txt_doc,
            email: this.docu.email,
        });
        this.form.updateValueAndValidity();
    }

    async submitUpdate() {
        console.log(this.docu);
        let response: Observable<Document>;
        response = this.docserv.UpdateDocument(
            this.docu.id,
            this.form.value
        );
        response.pipe(take(1))
                .subscribe((docu) => {
                    this.form.reset();
                    this.closeModal(docu);
                }); 
    }
}
