import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdvisePage } from './advise';

@NgModule({
  declarations: [
    AdvisePage,
  ],
  imports: [
    IonicPageModule.forChild(AdvisePage),
  ],
  exports: [
    AdvisePage
  ]
})
export class AdvisePageModule {}
