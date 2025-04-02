import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, catchError, firstValueFrom, lastValueFrom, take, tap } from 'rxjs';
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

  showInfo: boolean = false;
  showContactContainer: boolean = false;
  url = environment.baseUrl + '/contacts/';


  constructor(
    private http: HttpClient,
  ) {}


  async getContacts() {
    try {
      const data = await lastValueFrom(
        this.loadContacts().pipe(
          catchError(error => {
            console.error('Error loading contacts', error);
            throw error;
          })
        )
      );
  
      this.contacts.set(data);
  
    } catch (error) {
      console.error('Failed to get contacts:', error);
    }
  }
  
  private loadContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url);
  }

  async updateContact(form: FormGroup, id: number) {
    const url = `${this.url}${id}/`;
    const data = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      mail: form.value.email,
      phone: form.value.phone
    };
  
    try {
      await lastValueFrom(
        this.http.put(url, data).pipe(
          catchError(error => {
            console.error('Error updating contact', error);
            throw error;
          })
        )
      );
  
      const updatedIndex = this.contacts().findIndex(contact => contact.id === id);
      if (updatedIndex !== -1) {
        const updatedContacts = [...this.contacts()];
        updatedContacts[updatedIndex] = { id, ...data };
        this.contacts.update(() => updatedContacts);
      }
  
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  }

  async addContact(form: FormGroup) {
    const data = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      mail: form.value.email,
      phone: form.value.phone
    };
  
    try {
      const response = await lastValueFrom(
        this.http.post<Contact>(this.url, data).pipe(
          catchError(error => {
            console.error('Contact was not added', error);
            throw error;
          })
        )
      );
  
      this.contacts.update(items => [...items, response]);
  
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  }

  async deleteContact(id: number) {
    const url = `${this.url}${id}/`;
  
    try {
      await lastValueFrom(
        this.http.delete(url).pipe(
          catchError(error => {
            console.error('Error deleting contact', error);
            throw error; 
          })
        )
      );
  
      const filteredContacts = this.contacts().filter(contact => contact.id !== id);
      this.contacts.update(items => [...filteredContacts]);
      this.showInfo = false;
      this.showContactContainer = false;
  
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  }



}
