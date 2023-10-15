import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, from, lastValueFrom, tap } from 'rxjs';
import { FormGroup } from '@angular/forms';

export interface Contact {
  id: number,
  first_name: string;
  last_name: string;
  mail: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contacts: Contact[] = [
    { id: 1, first_name: 'Alice', last_name:'Müller',   mail: 'alice@example.com', phone: '01756245'},
  ];

  myContacts$: BehaviorSubject<any> = new BehaviorSubject<string>('');
  url = environment.baseUrl + '/contacts/';



  constructor(
    private http: HttpClient,

    ) {
  }


  // loadContacts(): Observable<any> {
  //   return from((this.http.get(this.url)))
  // }

  getContacts(){
    this.loadContacts().subscribe((data) => {
      this.myContacts$.next(data);
      this.contacts = data;
    });
  }

  

  private loadContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url).pipe(
      tap((data) => {
        this.contacts = data;
        this.myContacts$.next(data);
        console.log(this.contacts);
        
      })
    );
  }

  // loadContacts() {
  //   return this.http.get<Contact[]>(this.url);
  // }


  updateContact(form:FormGroup , id:number){
      const url = `${this.url}${id}/`;
      const data = {
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        mail: form.value.email,
        phone: form.value.phone
      };
      return lastValueFrom(this.http.put(url, data));
    }


  addContact(form: FormGroup) {
    const data = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      mail: form.value.email,
      phone: form.value.phone
    };

    try {
      return lastValueFrom(this.http.post(this.url, data));
    } catch (e) {
      console.log('Folgender Fehler', e);
      return false;
    }
  }


  deleteContact(id: number) {    
    const url = `${this.url}${id}/`; 
    return lastValueFrom(this.http.delete(url));
  }




}
