import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import {
  AngularFirestoreCollection,
  AngularFirestore
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "kat-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit {
  @ViewChild("msgContainer") private messagesContainer: ElementRef;

  @Input() userAuth: string;
  messages: Message[];
  unauthorized: boolean = true;
  private msgRef: AngularFirestoreCollection<Message>;

  constructor(private db: AngularFirestore, public afAuth: AngularFireAuth) {
    this.msgRef = db.collection<Message>("messages", ref =>
      ref.orderBy("timestamp")
    );
  }

  ngOnInit() {
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
}
