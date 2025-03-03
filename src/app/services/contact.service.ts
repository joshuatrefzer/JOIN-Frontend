import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, firstValueFrom, take, tap } from 'rxjs';
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

  contacts: WritableSignal<Contact[]> = signal([]);

  // myContacts$: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);
  showInfo: boolean = false;
  showContactContainer: boolean = false;
  url = environment.baseUrl + '/contacts/';


  constructor(
    private http: HttpClient,
  ) {
  }


  getContacts() {
    this.loadContacts().pipe(take(1)).subscribe((data) => {
      this.contacts.set(data);
    });
  }


  private loadContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url).pipe(
      take(1),
      tap((data) => {
        this.contacts.set(data);
      })
    );
  }


  /**
  * Asynchronously fetches contacts from the server and updates the 'myContacts$' subject.
  */
  async fetchContacts() {
    // Fetch contacts from the server using an HTTP GET request
    const contactResponse = await firstValueFrom(this.http.get<Contact[]>(this.url));
    // Update 'myContacts$' subject with the fetched contacts
  }


  /**
 * Updates a contact on the server with the provided form data.
 * @param form - The FormGroup containing the updated contact information.
 * @param id - The ID of the contact to be updated.
 */
  updateContact(form: FormGroup, id: number) {
    const url = `${this.url}${id}/`;
    const data = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      mail: form.value.email,
      phone: form.value.phone
    };

    this.http.put(url, data).subscribe(res => {
      const updatedIndex = this.contacts().findIndex(contact => contact.id === id);
      // If the contact is found, update it in the 'contacts' array
      if (updatedIndex !== -1) {
        this.contacts()[updatedIndex] = { id, ...data };
      }
      // Emit the updated contacts through the 'myContacts$' subject
    }, (error) => {
      console.error('Error updating contact', error);
    });
  }


  /**
  * Adds a new contact to the server with the provided form data.
  * @param form - The FormGroup containing the new contact information.
  */
  addContact(form: FormGroup) {
    const data = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      mail: form.value.email,
      phone: form.value.phone
    };

    this.http.post(this.url, data).subscribe((response: any) => {
      
      this.contacts.update(items => [...this.contacts() , response]);
      console.log('Wurde hier das richtige hinzugefügt?');
      
    }, (error) => {
      console.error('Contact was not added', error);
    });
  }

  deleteContact(id: number) {
    const url = `${this.url}${id}/`;
    this.http.delete(url).subscribe(() => {
      
      const filteredContacts = this.contacts().filter(contact => contact.id !== id);
      this.contacts.update(items => [...filteredContacts]);
      // this.myContacts$.next(this.contacts);
      this.showInfo = false;
      this.showContactContainer = false;
    }, (error) => {
      console.error('Error deleting contact', error);
    });
  }



}
