import { RouterStateModel } from '@ngxs/router-plugin';
import { MessageDetailPageStateModel } from '../../pages/message-detail/message-detail.model';
import { SettingsPageStateModel } from '../../pages/settings/settings.model';
import { MainPageStateModel } from '../../tabs/main/main.model';
import { MessagesPageStateModel } from '../../tabs/messages/messages.model';
import { ProfilePageStateModel } from '../../tabs/profile/profile.model';
import { ServicesPageStateModel } from '../../tabs/services/services.model';

export interface AppStoreModel {
  main: MainPageStateModel;
  add: ServicesPageStateModel;
  scan: MessagesPageStateModel;
  profile: ProfilePageStateModel;
  settings: SettingsPageStateModel;
  messageDetail: MessageDetailPageStateModel;
  router: RouterStateModel;
}

export interface AppStoreLoadingStatesModel {
  isLoading: boolean;
  isFailed: boolean;
  isSuccess: boolean;
  error: string;
}
