import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '.';
import { ConversationComponent } from '@app/conversation/conversation.component';
import { AddEditComponent } from '@app/_components/add-edit.component';
import { HomeRoutingModule } from './home-routing.module';
import { IonicModule } from '@ionic/angular';
import { JoinChatComponent } from '@app/join-chat/join-chat.component';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HomeRoutingModule,
        IonicModule
    ],
    declarations: [
        HomeComponent,
        ConversationComponent,
        AddEditComponent,
        JoinChatComponent
    ]
})
export class HomeModule { }