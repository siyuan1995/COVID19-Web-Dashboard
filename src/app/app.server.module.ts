import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule
     // This is for lazy loading.
  ],
  bootstrap: [AppComponent],
  providers: []
})
export class AppServerModule {}
