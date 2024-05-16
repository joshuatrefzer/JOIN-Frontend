import { Injectable } from '@angular/core';
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

  contacts: Contact[] = [];
  myContacts$: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);
  showInfo: boolean = true;
  showContactContainer: boolean = false;
  url = environment.baseUrl + '/contacts/';


  constructor(
    private http: HttpClient,
  ) {
  }


  /**
 * Retrieves contacts from the server and updates the 'contacts' property.
 * Emits the fetched contacts through the 'myContacts$' subject.
 */
  getContacts() {
    // Load contacts from the server using 'loadContacts' method
    this.loadContacts().pipe(take(1)).subscribe((data) => {
      // Update 'contacts' property with the fetched data
      this.contacts = data;
      // Emit the fetched contacts through 'myContacts$' subject
      this.myContacts$.next(data);
    });
  }


  /**
  * Fetches contacts from the server using an HTTP GET request.
  * @returns {Observable<Contact[]>} - An observable that emits the fetched contacts.
  */
  private loadContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url).pipe(
      take(1),
      // Update 'contacts' property and emit the fetched contacts through 'myContacts$' subject
      tap((data) => {
        this.contacts = data;
        this.myContacts$.next(data);
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
    this.myContacts$.next(contactResponse);
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
      // Find the index of the updated contact in the 'contacts' array
      const updatedIndex = this.contacts.findIndex(contact => contact.id === id);
      // If the contact is found, update it in the 'contacts' array
      if (updatedIndex !== -1) {
        this.contacts[updatedIndex] = { id, ...data };
      }
      // Emit the updated contacts through the 'myContacts$' subject
      this.myContacts$.next(this.contacts);
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
      // Add the newly created contact to the 'contacts' array
      this.contacts.push(response);
      // Emit the updated contacts through the 'myContacts$' subject
      this.myContacts$.next(this.contacts);
    }, (error) => {
      console.error('Contact was not added', error);
    });
  }


  /**
  * Deletes a contact from the server with the provided ID.
  * @param id - The ID of the contact to be deleted.
  */
  deleteContact(id: number) {
    const url = `${this.url}${id}/`;
    this.http.delete(url).subscribe(() => {
      // Remove the deleted contact from the 'contacts' array
      this.contacts = this.contacts.filter(contact => contact.id !== id);
      // Emit the updated contacts through the 'myContacts$' subject
      this.myContacts$.next(this.contacts);
      // Reset showInfo and showContactContainer flags
      this.showInfo = false;
      this.showContactContainer = false;
    }, (error) => {
      console.error('Error deleting contact', error);
    });
  }



}
