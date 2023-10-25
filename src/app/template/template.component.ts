import { Component } from '@angular/core';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {
  constructor(public templateService: TemplateService){
  }

  summary: boolean = false;
  addTask: boolean = false;
  board: boolean = false;
  contacts: boolean = false;
  legals: boolean = false;


  updateLink(link:string) {
    this.resetLinks()
    if (link == 'summary') {
      this.summary = true;
    }
    if (link == 'addTask') {
      this.addTask = true;
    }
    if (link == 'board') {
      this.board = true;
    }
    if (link == 'contacts') {
      this.contacts = true;
    }
    if (link == 'legals') {
      this.legals = true;
    }
  }

  resetLinks(){
    this.summary = false;
    this.addTask = false;
    this.board = false;
    this.contacts = false;
    this.legals = false;
  }
}
