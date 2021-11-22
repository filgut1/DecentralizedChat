import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConversationComponent } from '@app/conversation/conversation.component';
import { AuthGuard } from '@app/_helpers';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { 
    path: 'tabs', 
    component: HomeComponent,
    children: [
      {
        path: 'chats',
        loadChildren: () => import('../chats/chats.module').then( m => m.ChatsPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'contacts',
        loadChildren: () => import('../contacts/contacts.module').then( m => m.ContactsPageModule),
        canActivate: [AuthGuard]
      },
    ],
    canActivate: [AuthGuard] 
  },
  { path: 'conversation', component: ConversationComponent, canActivate: [AuthGuard] },
  {
    path: '',
    redirectTo: '/tabs/chats',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }