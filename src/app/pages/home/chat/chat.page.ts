import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild(IonContent, {static:false}) content: IonContent;
  id:string;
  name:string;
  chats: Observable<any[]>;
  mensaje:string;
  isLoading:boolean;
  model={
    icon:'chatbubbles-outline',
    title:'No Conversation',
    color:'Warning',
  };

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public chatService: ChatService
  ){}

  ngOnInit() {
    const data: any = this.route.snapshot.queryParamMap;
    console.log('data importante: ', data);
    //this.name= data.params.name||'nombre predeterminado';
    console.log('nombre asignado: ',this.name);
    if (data.params.name) {
      this.name=data.params.name;
    }
    const id = this.route.snapshot.paramMap.get('id');
    console.log('check id: ',id);
    if (!id) {
      this.navCtrl.back();
      return;    
    }
    this.id=id;
    this.chatService.getChatRoomMessages(this.id);
    this.chats= this.chatService.selectedChatRoomMessages;
    console.log(this.chats);  
  }

  ngAfterViewChecked(){
    this.scrollToBottom();
  }

  scrollToBottom(){
    console.log('scroll bottom');
    if (this.chats) this.content.scrollToBottom(500);
  }


  async enviarMensaje(){
    if (!this.mensaje || this.mensaje?.trim()=='') {
      return;      
    }
    try{
      this.isLoading=true;
      await this.chatService.sendMessage(this.id, this.mensaje);
      this.mensaje='';
      this.isLoading=false;
      this.scrollToBottom();
    }catch(e){
      this.isLoading=false;
      console.log(e);
    }
  }

}
