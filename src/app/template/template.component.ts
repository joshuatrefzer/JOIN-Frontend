import { Component, HostListener } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {

  activeLink: string = '/summary';

  constructor(
    public templateService: TemplateService,
    public userService: UserService,
    public auth: AuthenticationService,
    public router: Router,
  ) {
    this.checkForMobileView();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveLink();
      }
    });
  }


  /**
 * Sets the active link based on the current router URL.
 */
  setActiveLink() {
    this.activeLink = this.router.url;
  }


  /**
  * Listens for window resize events and checks if the view should be mobile.
  * @param {Event} event - The resize event.
  */
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkForMobileView();
  }


  /**
  * Checks if the current window width indicates a mobile view.
  * If the width is less than 1200 pixels, sets mobileview to true, otherwise sets it to false.
  */
  checkForMobileView() {
    if (window.innerWidth < 1200) {
      this.templateService.mobileview = true;
    } else {
      this.templateService.mobileview = false;
    }
  }


  /**
  * Toggles the visibility of the logout menu popup.
  */
  togglePopup() {
    this.templateService.logOutMenu = !this.templateService.logOutMenu;
  }


  /**
  * Gets the first letter of a given name and converts it to uppercase.
  * @param {string} name - The name to get the first letter from.
  * @returns {string} - The first letter of the name in uppercase.
  */
  getFirstLetter(name: string) {
    let letter = name.charAt(0).toUpperCase();
    return letter;
  }


  /**
  * Logs the user out by removing the token from local storage and reloading the window.
  */
  logOut() {
    localStorage.removeItem('Token');
    window.location.reload();
  }


  /**
  * Navigates to the specified component and toggles the popup.
  * @param {string} component - The name of the component to navigate to.
  */
  navigate(component: string) {
    this.router.navigate([component]);
    this.togglePopup();
  }


}
