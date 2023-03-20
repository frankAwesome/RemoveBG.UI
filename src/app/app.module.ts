import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from './components/spinner/spinner.component';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { NgxSpinnerModule } from 'ngx-spinner';

import { NgParticlesModule } from "ng-particles";


interface NgxSpinnerConfig {
  type?: string;
}

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
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
