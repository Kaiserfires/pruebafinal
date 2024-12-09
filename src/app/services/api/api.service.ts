import { addDoc, collection, collectionData, doc, docData, Firestore, getDoc, getDocs, orderBy, OrderByDirection, query, setDoc, where } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private firestore: Firestore) {}

  docRef(path){
    return doc(this.firestore, path)
  }

  collectionRef(path){
    return collection(this.firestore, path);
  }

  setDocument(path, data){
    const dataRef=this.docRef(path);
    return setDoc(dataRef,data);

  }

  addDocument(path, data){
    const dataRef=this.collectionRef(path);
    return addDoc<any,any>(dataRef,data);

  }

  getDocById(path){
    const dataRef = this.docRef(path);
    return getDoc(dataRef);
  }

  getDocs(path, queryFn?){
    let dataRef:any= this.collectionRef(path);
    if (queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    return getDocs<any,any>(dataRef);
  }

  collectionDataQuery(path, queryFn?){
    let dataRef: any= this.collectionRef(path);
    if (queryFn) {
      const q=query(dataRef,queryFn);
      dataRef=q;
    }
    
    const collection_data =collectionData<any>(dataRef, {idField: 'id'});
    collection_data.subscribe({
      next:(data)=> console.log('datos recuperados: ',data),
      error:(err)=> console.log('error recuperando datos: ',err),
    });
    console.log('estos son lso mensajes: ',collection_data);
    return collection_data;
  }

  docDataQuery(path, id?, queryFn?){
    let dataRef:any=this.docRef(path);
    if (queryFn) {
      const q = query(dataRef,queryFn);
      dataRef=q;      
    }
    let doc_data;
    if(id) doc_data = docData<any>(dataRef,{idField:'id'});
    else doc_data = docData<any>(dataRef);
    return doc_data;

  }

  whereQuery(fieldPath, condition, value){
    return where(fieldPath, condition, value);
  }

  orderByQuery(fieldPath,directionStr: OrderByDirection ='asc'){
    return orderBy(fieldPath,directionStr);
  }
  
 }
