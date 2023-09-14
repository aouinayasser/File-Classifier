import { UsersStoriesModel } from '../../components/users-stories/users-stories.model';
import { AppStoreLoadingStatesModel } from '../../core/store/store.model';

export interface NewsModel {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  image: string;
  content: string;
  likes: number;
  comments: number;
  shared: number;
  views: number;
}

export interface MainTabModel {
  id: string;
  name: string;
}

export interface MainTabsStateModel extends AppStoreLoadingStatesModel {
  listData: MainTabModel[];
}

export interface StoriesStateModel extends AppStoreLoadingStatesModel {
  listData: UsersStoriesModel[];
}

export interface NewsStateModel extends AppStoreLoadingStatesModel {
  activePage: number;
  pages: number[];
  listData: {
    [page: string]: NewsModel[];
  };
}

export interface MainPageStateModel {
  tabs: MainTabsStateModel;
  stories: StoriesStateModel;
  news: NewsStateModel;
}

export interface Document {
    id: number;
    name_doc: string;
    type_doc: string;
    img_doc: string;
    txt_doc: string;
    email: string;
}