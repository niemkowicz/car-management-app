import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { CarListComponent } from './app/car-list.component';
import { CarDetailsComponent } from './app/car-details.component';

const routes: Routes = [
  { path: '', component: CarListComponent }, // Domyślny widok samochodów
  { path: 'car-details/:id', component: CarDetailsComponent }, // Szczegóły samochodu
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
}).catch((err) => console.error(err));
