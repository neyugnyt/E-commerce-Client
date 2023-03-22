import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/core/not-found/not-found.component';
import { ServerErrorComponent } from './components/core/server-error/server-error.component';
import { TestErrorComponent } from './components/core/test-error/test-error.component';
import { HomeComponent } from './components/home/home.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path:'test-error', component: TestErrorComponent},
  {path:'not-found', component: NotFoundComponent},
  {path:'server-error', component: ServerErrorComponent},
  {path: 'shop', loadChildren: () => import('./components/shop/shop.module').then(mod => mod.ShopModule)},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
