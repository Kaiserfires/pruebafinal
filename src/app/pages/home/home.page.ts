import { Component, OnInit, ViewChild } from '@angular/core';
import { user } from '@angular/fire/auth';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Observable, take } from 'rxjs';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('newchat') modal:ModalController;
  @ViewChild('popover') popover:PopoverController;

  segment='chats';
  open_new_chat=false;
  users: Observable<any[]>;
  chatRooms: Observable<any[]>;

  /*users=[
    {id:1, name:'Roberto', photo:'https://i.pravatar.cc/335'},
    {id:2, name:'Roberta', photo:'https://i.pravatar.cc/365'}
  ];*/
  /*chatRooms=[
    {id:1, name:'Roberto', photo:'https://i.pravatar.cc/335'},
    {id:2, name:'Roberta', photo:'https://i.pravatar.cc/365'}
  ];*/

  constructor(
    private router: Router,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.getRooms();
  }

  getRooms(){
    this.chatService.getChatRooms();
    this.chatRooms=this.chatService.chatRooms;
    console.log('chatRooms: ',this.chatRooms);
  }

  async logout(){
    try{
      console.log('logout');
      this.popover.dismiss();
      await this.chatService.auth.logout();
      this.router.navigateByUrl('/login', {replaceUrl: true});
    }catch(e){
      console.log(e);

    }
  }
  /*logout(){ no actualiza la pantalla
    this.popover.dismiss();
    this.chatService.auth.logout();
  }*/

  onSegmentChanged(event:any){
    console.log(event);

  }

  newChat(){
    this.open_new_chat=true;
    if (!this.users) this.getUsers();
  }

  getUsers(){
    this.chatService.getUsers();
    this.users=this.chatService.users;
  }


  onWillDismiss(event:any){
    console.log(event)
  }
  
  cancel(){
   
    this.open_new_chat=false;
    this.modal.dismiss(); 
  }

  async starChat(item){ //crea los chatrooms
    try{
      const room= await this.chatService.createChatRoom(item?.uid);
      console.log('room: ',room);
      this.cancel();
      const navData: NavigationExtras={
        queryParams:{
          name: item?.name
        }
      };
      this.router.navigate(['/','home','chats', room?.id],navData);
    }catch(e){
      console.log(e);
    }
  }

  getchat(item){
    (item?.user).pipe(
      take(1)
    ).subscribe(user_data => {
      console.log('data: ', user_data);
        const navData: NavigationExtras={
          queryParams:{
            name: user_data?.name
          }
        };
        this.router.navigate(['/','home','chats',item?.id], navData);
      });    
  }

  getUser(user:any){
    return user;
  }

}
