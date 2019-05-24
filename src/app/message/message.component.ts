import { Component, OnInit, Input } from "@angular/core";
import { Message } from "../message";
@Component({
  selector: "kat-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.scss"]
})
export class MessageComponent implements OnInit {
  @Input() message: Message;
  @Input() userAuth: string;

  constructor() {}

  ngOnInit() {}
}
