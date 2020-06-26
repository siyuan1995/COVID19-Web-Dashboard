import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LMapComponent} from './LMap/LMap.component';
import {Covid19HttpService} from './services/Covid19Http.service';

@NgModule({
  declarations: [
    AppComponent,
    LMapComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    Covid19HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
