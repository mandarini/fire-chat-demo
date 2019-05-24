import { Injectable } from "@angular/core";
import {
  AngularFirestoreCollection,
  AngularFirestore
} from "@angular/fire/firestore";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";

@Injectable({
  providedIn: "root"
})
export class ChatService {
  messages: AngularFirestoreCollection<Message>;

  constructor(private db: AngularFirestore) {
    this.messages = db.collection<Message>("messages");
  }

  addMsg(msg) {
    return this.messages.add(msg);
  }
}
