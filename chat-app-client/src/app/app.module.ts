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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox'

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NgbModule,
        MatCheckboxModule
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