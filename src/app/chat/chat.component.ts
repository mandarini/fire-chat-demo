import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import {
  AngularFirestoreCollection,
  AngularFirestore
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase/app";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { AngularFireDatabase } from "@angular/fire/database";

@Component({
  selector: "kat-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit {
  @ViewChild("msgContainer") private messagesContainer: ElementRef;

  @Input() userAuth: string;
  @Input() user_id: string;
  messages: Message[];
  unauthorized: boolean = true;
  private msgRef: AngularFirestoreCollection<Message>;

  constructor(
    private db: AngularFirestore,
    public afAuth: AngularFireAuth,
    private afMessaging: AngularFireMessaging,
    private rtdb: AngularFireDatabase
  ) {
    this.msgRef = db.collection<Message>("messages", ref =>
      ref.orderBy("timestamp")
    );
  }

  ngOnInit() {
    console.log(this.user_id);
    // We save the Firebase Messaging Device token and enable notifications.
    this.saveMessagingDeviceToken();
    this.msgRef.valueChanges().subscribe(
      res => {
        this.messages = res;
        this.unauthorized = false;
      },
      error => {
        this.unauthorized = true;
        this.afAuth.auth.signOut();
      }
    );
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  saveMessagingDeviceToken() {
    return this.afMessaging.requestToken.subscribe(
      currentToken => {
        if (currentToken) {
          console.log("Got FCM device token:", currentToken);
          // Save the Device Token to the datastore.
          this.rtdb.object(`/fcmTokens/${currentToken}`).set(this.user_id);
        } else {
          // Need to request permissions to show notifications.
          return this.requestNotificationsPermissions();
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  // Requests permissions to show notifications.
  requestNotificationsPermissions() {
    console.log("Requesting notifications permission...");
    return this.afMessaging.requestPermission.subscribe(
      () => {
        this.saveMessagingDeviceToken();
        console.log("Permission granted!");
      },
      error => {
        console.error(error);
      }
    );
  }
}
