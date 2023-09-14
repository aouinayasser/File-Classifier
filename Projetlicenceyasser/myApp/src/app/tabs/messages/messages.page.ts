import { Component, OnInit, ViewChild } from '@angular/core';
import {
  Platform,
  Config,
  IonContent,
  IonRefresher,
  NavController,
} from '@ionic/angular';
import { Store } from '@ngxs/store';
import { getSkeletonLimitHeightItems } from '../../core/urils/common-functions';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import { Plugins } from '@capacitor/core';
import { createWorker } from 'tesseract.js';
import * as Tesseract from 'tesseract.js';
import { DocumentService } from '../../services/document.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: 'messages.page.html',
  styleUrls: ['messages.page.scss'],
})
export class MessagesPage implements OnInit {
  @ViewChild(IonContent) ionContent: IonContent;
  @ViewChild(IonRefresher) ionRefresher: IonRefresher;

  isIos = false;

  skeletronItems = getSkeletonLimitHeightItems(66);

    worker: Tesseract.Worker;
    workerReady = false;
    image = 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png';
    ocrResult = '';
    captureProgress = 0;
    form: FormGroup;
    imgurl = '';
    doctype = 'Non reconnu';
    email: any;

    constructor(private docserv: DocumentService,
    private sanitizer: DomSanitizer,
    public platform: Platform,
    private store: Store,
    private config: Config,
    private navController: NavController,
  ) {
      this.isIos = this.config.get('mode') === 'ios';
      this.loadWorker();
    }

  async loadWorker() {
        this.worker = createWorker({
            logger: progress => {
                console.log(progress);
                if (progress.status == 'recognizing text') {
                    this.captureProgress = parseInt('' + progress.progress * 100);
                }
            }
        });
      await this.worker.load();
      await this.worker.loadLanguage('eng+fra');
      await this.worker.initialize('eng+fra');
      console.log('FIN');
      this.workerReady = true;
    }

    typedocumentDetect(ocrResult) {

        var listFr = [{ name: "rapport" }, { name: "devis" }, { name: "facture" }, { name: "thèses" }, { name: "mémoire" }, { name: "test" }, { name: "loi" }, { name: "règlement" }, { name: "norme" }, { name: "manuel" }, {  name: "sommaire" }, {  name: "synthèse" }, { name: "statistique" }, { name: "carte" }, { name: "brevet" }, { name: "article" }, { name: "reçu" }, { name: "paroles" }, { name: "cours" }, { name: "carte nationale d'identité" }, { name: "permis de conduire" }, { name: "assurance" }];
        var listEn = [{ name: "report" }, { name: "estimate" }, { name: "invoice" }, { name: "theses" }, { name: "dissertation" }, { name: "test" }, { name: "law" }, { name: "regulation" }, { name: "standard" }, { name: "manual" }, { name: "summary"  }, { name: "statistics" }, { name: "map"}, { name: "patent" }, { name: "article" }, { name: "receipt" }, { name: "lyrics" }, { name: "course" }, { name: "national identity card" }, { name: "driving license" }, { name: "insurance" }];

        var test = false;
        //filter type
            listFr.filter(item => {
                if (ocrResult.toLowerCase().indexOf(item.name.toLowerCase()) > -1) {
                    this.doctype = item.name;
                    
                    console.log(ocrResult.toLowerCase().indexOf(item.name.toLowerCase()) > -1);
                }
            });
            listEn.filter(item => {
            if (ocrResult.toLowerCase().indexOf(item.name.toLowerCase()) > -1) {
                this.doctype = item.name;

                console.log(ocrResult.toLowerCase().indexOf(item.name.toLowerCase()) > -1);
            }
        });

            
            console.log("le type de document est: " + this.doctype);
    }

    async recognizeImage() {
        const result = await this.worker.recognize(this.image);
        console.log(result);
        this.ocrResult = result.data.text;
        this.imgurl = this.image;
        this.typedocumentDetect(this.ocrResult);
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

  async takePicture() {
        const image = await Plugins.Camera.getPhoto({
            quality: 100,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera
        });
      console.log('image: ', image);
      this.image = image.dataUrl;
    }

  ionViewDidLeave() {}
}
