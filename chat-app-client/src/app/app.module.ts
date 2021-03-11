import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { GunDB } from './_services';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';
import { ChatsComponent } from './chats/chats.component';
import { ConversationComponent } from './conversation/conversation.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        ChatsComponent ,
        ConversationComponent,   
    ],
    providers: [
        GunDB
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };