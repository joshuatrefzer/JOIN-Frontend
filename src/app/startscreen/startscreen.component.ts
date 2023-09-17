import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-startscreen',
  templateUrl: './startscreen.component.html',
  styleUrls: ['./startscreen.component.scss']
})
export class StartscreenComponent implements OnInit {
  hideImage:boolean = false;

  ngOnInit():void {
    setTimeout(() => {
      this.hideImage = true;
    }, 1700);
  }


}
