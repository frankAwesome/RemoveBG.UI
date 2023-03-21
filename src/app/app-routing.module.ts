import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadcomponentComponent } from './components/uploadcomponent/uploadcomponent.component';
import { EditimageComponent } from './pages/editimage/editimage.component';

const routes: Routes = [
  { path: '', component: UploadcomponentComponent },
  { path: 'imageedit', component: EditimageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
