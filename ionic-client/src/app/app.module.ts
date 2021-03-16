import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GunDB } from './_services';
import { AlertService } from './_services';
import { HomeComponent } from './home';
import { ChatsComponent } from './chats/chats.component';
import { ConversationComponent } from './conversation/conversation.component';
import { AddEditComponent } from './contacts/add-edit.component';
import { LoginComponent } from './account/login.component';
import { RegisterComponent } from './account/register.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ChatsComponent ,
    ConversationComponent,
    AddEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule.forRoot()
  ],
  providers: [
    GunDB,
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
