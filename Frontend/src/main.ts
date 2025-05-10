import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HomePageComponent } from './app/Pages/home-page/home-page.component';
import { TestComponent } from './app/test/test.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
