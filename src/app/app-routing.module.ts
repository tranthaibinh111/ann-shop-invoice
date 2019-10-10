import { NgModule, Type } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { RootComponent } from './components/root/root.component';

export function makeRoutes(): Routes {
  return [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'invoice'
    },
    {
      path: 'invoice',
      loadChildren: './modules/invoice/invoice.module#InvoiceModule'
    },
    {
      path: '**',
      component: PageNotFoundComponent
    }
  ];
}

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    data: {
      headerLayout: 'compact'
    },
    children: makeRoutes()
  },
  {
    path: '**',
    redirectTo: 'compact'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
