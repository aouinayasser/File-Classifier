import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { AppearancePageRoutingModule } from './appearance-routing.module';

import { AppearancePage } from './appearance.page';

@NgModule({
  imports: [CommonModule, AppearancePageRoutingModule, SharedModule],
  declarations: [AppearancePage],
})
export class AppearancePageModule {}
