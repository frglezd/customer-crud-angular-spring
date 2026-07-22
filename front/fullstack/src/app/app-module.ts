import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Ejemplo } from './ejemplo/ejemplo';
import { CustomerListComponent } from './components/customer-list/customer-list';
import { CustomerAdd } from './components/customer-add/customer-add';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [App, Ejemplo, CustomerListComponent, CustomerAdd],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideClientHydration(withEventReplay()), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
