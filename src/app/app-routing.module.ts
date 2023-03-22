import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadcomponentComponent } from './components/uploadcomponent/uploadcomponent.component';
import { DonateComponent } from './pages/donate/donate.component';
import { EditimageComponent } from './pages/editimage/editimage.component';

const routes: Routes = [
  { path: '', component: UploadcomponentComponent },
  { path: 'imageedit', component: EditimageComponent},
  { path: 'donate', component: DonateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
