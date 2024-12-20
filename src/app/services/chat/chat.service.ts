import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { map, Observable, of, switchMap } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  currentUserId: string;
  public users: Observable<any>;
  public chatRooms: Observable<any>;
  public selectedChatRoomMessages: Observable<any>;

  constructor(
    public auth: AuthService,
    private api: ApiService
  ) { 
    this.getId();
  }

  getId(){
    this.currentUserId=this.auth.getId();
  }

  getUsers(){
    this.users=this.api.collectionDataQuery(
      'users',
      this.api.whereQuery('uid','!=', this.currentUserId)
    );
  }

  async createChatRoom(user_id){
    let room:any;
    const querySnapshot=await this.api.getDocs(
      'chatRooms',
      this.api.whereQuery(
        'members',
        'in',
        [[user_id, this.currentUserId], [this.currentUserId, user_id]]
      )
    );
    room=await querySnapshot.docs.map((doc:any)=>{
      let item =doc.data();
      item.id=doc.id;
      return item;
    });
    console.log('exist docs: ',room);
    if (room?.length > 0) return room[0];
    const data ={
      members:[
        this.currentUserId,
        user_id
      ],
      type: 'private',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    room = await this.api.addDocument('chatRooms', data);
    return room;
  }catch(e){
    throw(e);
  }

  getChatRooms(){
    this.chatRooms=this.api.collectionDataQuery(
      'chatRooms',
      this.api.whereQuery('members', 'array-contains',this.currentUserId)
    ).pipe(
      map((data:any[])=>{
        console.log('room data: ',data);
        data.map((element)=>{
          const user_data=element.members.filter(x => x !=this.currentUserId);
          console.log(user_data);
          const user= this.api.docDataQuery(`users/${user_data[0]}`,true);
          element.user=user;
        });
        return (data);
      }),
      switchMap(data=> {
        return of (data);
      })
    );
  }

  getChatRoomMessages(chatRoomId){
    this.selectedChatRoomMessages=this.api.collectionDataQuery(
      `chats/${chatRoomId}/messages`,
      this.api.orderByQuery('createdAt', 'desc')
    )
    .pipe(map((arr: any) => {
      console.log('Mensajes recuperados antes de invertir:', arr);
      return arr.reverse();
    }));
  }

  async sendMessage(chatId, msg){
    try{
      console.log('cargando');
      const new_message={
        menssage: msg,
        sender: this.currentUserId,
        createdAT: new Date()
      };
      console.log('este mensaje',msg ,this.currentUserId);
      console.log(chatId);
      if (chatId) {
        console.log('esta enviado mensaje',msg ,this.currentUserId);
        await this.api.addDocument(`chats/${chatId}/messages`, new_message);
        console.log('se envio mensaje',msg ,this.currentUserId);
      }
    }catch(e){
      throw(e);
    }
  }

}
