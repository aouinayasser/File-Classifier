import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IonContent, IonItemSliding, NavController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { AppStoreModel } from '../../core/store';
import { MessageModel } from '../../tabs/messages/messages.model';
import { MessageDetailActions, MessageSendActions } from './message-detail.actions';
import { MessagesGrouped } from './message-detail.model';
import { selectMessageDetail, selectMessagesListDetail } from './message-detail.selectors';

@Component({
  selector: 'app-services',
  templateUrl: 'message-detail.page.html',
  styleUrls: ['message-detail.page.scss'],
})
export class MessageDetailPage implements OnInit {
  @ViewChild(IonContent) ionContent: IonContent;

  @Select(selectMessageDetail()) messageDetail$: Observable<MessageModel>;
  @Select(selectMessagesListDetail()) messages$: Observable<MessagesGrouped[]>;

  amCalendarGroup = {
    sameDay: '[Today]',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD-MM-YYYY',
  };

  isPageScrolling = false;
  isAllowScroll = true;
  messageControl: FormControl = new FormControl('', [Validators.required]);
  ionContentScrolling: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private store: Store, private navController: NavController) {}

  trackBy(index) {
    return index;
  }

  openServicePage(explore) {
    this.navController.navigateForward(explore.link);
  }

  logScrollStart() {
    this.ionContentScrolling.next(true);
  }

  logScrolling(event) {
    // console.log('Scrolling', event);
  }

  logScrollEnd() {
    this.ionContentScrolling.next(false);
  }

  messageDragged(event, slidingItem: IonItemSliding) {
    if (event.detail.ratio === 1) {
      slidingItem.closeOpened();
    }
  }

  async sendMessage(event) {
    event.preventDefault();

    const messageId = this.store.selectSnapshot((state: AppStoreModel) => state.router.state.root.params.messageId);
    await lastValueFrom(this.store.dispatch(new MessageSendActions.Send(messageId, this.messageControl.value)));

    setTimeout(() => {
      this.messageControl.setValue('');
      this.ionContent.scrollToBottom(0);
    });
  }

  setupIonContentScrollingListner() {
    this.ionContentScrolling
      .pipe(
        tap((isScrolling) => {
          if (isScrolling) {
            this.isPageScrolling = isScrolling;
          }
        }),
        debounceTime(1000),
      )
      .subscribe((isScrolling) => (this.isPageScrolling = isScrolling));
  }

  ngOnInit() {
    this.setupIonContentScrollingListner();
  }

  ionViewWillEnter() {}

  ionViewDidEnter() {
    setTimeout(async () => {
      const messageId = this.store.selectSnapshot((state: AppStoreModel) => state.router.state.root.params.messageId);
      await lastValueFrom(this.store.dispatch(new MessageDetailActions.FetchMessageDetail(messageId)));
      await this.ionContent.scrollToBottom(0);
    });
  }

  ionViewDidLeave() {}
}
