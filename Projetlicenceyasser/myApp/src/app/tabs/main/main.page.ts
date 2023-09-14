import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll, IonRefresher, MenuController, ModalController, NavController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { from, lastValueFrom, Observable } from 'rxjs';
import { UsersStoriesModel } from '../../components/users-stories/users-stories.model';
import { AppStoreModel } from '../../core/store';
import { FetchNewsActions, MainTabsActions, StoriesActions } from './main.actions';
import { MainTabModel, NewsModel } from './main.model';
import { selectMainTabsList, selectNews, selectNewsIsLoading, selectStories } from './main.selectors';
import { LoadingController } from '@ionic/angular';
import { take, tap } from 'rxjs/operators';
import { DocumentService } from '../../services/document.service';
import { Document } from './main.model';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { EditPage } from '../../edit/edit.page';

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss'],
})
export class MainPage implements OnInit {
  @ViewChild(IonContent) ionContent: IonContent;
  @ViewChild(IonRefresher) ionRefresher: IonRefresher;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  @Select(selectMainTabsList()) tabs$: Observable<MainTabModel[]>;
  @Select(selectStories()) stories$: Observable<UsersStoriesModel[]>;

  @Select(selectNews()) news$: Observable<NewsModel[]>;
    @Select(selectNewsIsLoading()) newsIsLoading$: Observable<boolean>;

    @Input() docu: Document;

    documents$: Observable<Document[]>;
    constructor(private docserv: DocumentService, private modalCtrl: ModalController, private http: HttpClient, private store: Store,
        private menuController: MenuController, public navCtrl: NavController)
    {}

  trackBy(index) {
    return index;
  }

  toggleCameraMenu() {
    console.log('toggleCameraMenu');
    this.menuController.toggle('camera');
  }

  async doRefresh(event) {
    await lastValueFrom(this.store.dispatch(new FetchNewsActions.FetchNews(1, true)));
    await this.ionRefresher.complete();
  }

  async loadDataNewsPagination(event) {
    const activePage = this.store.selectSnapshot((state: AppStoreModel) => state.main.news.activePage);
    await lastValueFrom(this.store.dispatch(new FetchNewsActions.FetchNews(activePage + 1)));
    await this.infiniteScroll.complete();
  }
    docs: any = [];
    filtmail: any = [];
    email: any;
    async ngOnInit() {
        this.email = localStorage.getItem('email');
        this.http.get('http://localhost:8000/api/documents')
            .subscribe(data => {
                this.filtmail = data;
                console.log(data);
                this.docs = this.filtmail.filter(x => x.email == this.email);
                console.log(this.docs);
            });
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }
    id: any;
    find_object: any;
    async openEditModal(event) {
        this.id = event.srcElement.name;
        this.find_object = this.docs.find(x => x.id == this.id);
        const modal = await this.modalCtrl.create({
            component: EditPage,
            componentProps: { docu: this.find_object}
        });
        await modal.present();
        const { data: updatedDocument } = await modal.onDidDismiss();
        if (updatedDocument) {
            this.docu = updatedDocument;
            window.location.reload();
        }
    }

    async deleteDocument(event) {
        this.id = event.srcElement.name;
        this.docserv
            .deleteDocument(this.id)
            .pipe(take(1))
            .subscribe((docu) => {
                window.location.reload();
            });
    }

  ionViewDidEnter() {
    const activePage = this.store.selectSnapshot((state: AppStoreModel) => state.main.news.activePage);
    this.store.dispatch([
      new MainTabsActions.FetchMainTabs(),
      new StoriesActions.FetchStories(),
      new FetchNewsActions.FetchNews(activePage),
    ]);
    this.menuController.enable(true, 'camera');
  }

  ionViewDidLeave() {
    this.menuController.enable(false, 'camera');
    }
}
