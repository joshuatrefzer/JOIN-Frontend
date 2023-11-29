import { Component, HostListener } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {

  constructor(
    public templateService: TemplateService,
    public userService: UserService,
    public auth: AuthenticationService,
    public router: Router,
  ) {
    this.checkForMobileView();
   }


  summary: boolean = true;
  addTask: boolean = false;
  board: boolean = false;
  contacts: boolean = false;
  legals: boolean = false;



  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkForMobileView();
  }


  checkForMobileView() {
    if (window.innerWidth < 1200) {
      this.templateService.mobileview = true;
    } else {
      this.templateService.mobileview = false;
    }
  }


  togglePopup(){
    this.templateService.logOutMenu = !this.templateService.logOutMenu;
  }


  updateLink(link: string) {
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

  resetLinks() {
    this.summary = false;
    this.addTask = false;
    this.board = false;
    this.contacts = false;
    this.legals = false;
  }

  getFirstLetter(name: string) {
    let letter = name.charAt(0).toUpperCase();
    return letter;
  }

  logOut(){
    localStorage.removeItem('Token');
    this.auth.userIsLoggedIn = false;
    this.router.navigateByUrl('');
  }


}
