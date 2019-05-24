import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { FormsModule } from "@angular/forms";

import { AngularFireModule } from "@angular/fire";
import {
  AngularFirestoreModule,
  FirestoreSettingsToken
} from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireDatabaseModule } from "@angular/fire/database";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { ChatComponent } from "./chat/chat.component";
import { InputComponent } from "./input/input.component";
import { MessageComponent } from "./message/message.component";

@NgModule({
  declarations: [AppComponent, ChatComponent, InputComponent, MessageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireMessagingModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    }),
    ServiceWorkerModule.register("firebase-messaging-sw.js", {
      enabled: true
    })
  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule {}
