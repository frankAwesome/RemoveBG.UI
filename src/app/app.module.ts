import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from './components/spinner/spinner.component';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { NgxSpinnerModule } from 'ngx-spinner';

import { NgParticlesModule } from "ng-particles";
import { EditimageComponent } from './pages/editimage/editimage.component';
import { UploadcomponentComponent } from './components/uploadcomponent/uploadcomponent.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from './firebase/environment';
import { AboutComponent } from './pages/about/about.component';


interface NgxSpinnerConfig {
  type?: string;
}

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    EditimageComponent,
    UploadcomponentComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgParticlesModule,
    BrowserAnimationsModule,
    NgxSpinnerModule.forRoot({
      type: 'ball-scale-multiple'
    }),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
