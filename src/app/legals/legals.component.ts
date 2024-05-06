import { Component, OnDestroy, OnInit } from '@angular/core';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-legals',
  templateUrl: './legals.component.html',
  styleUrls: ['./legals.component.scss']
})
export class LegalsComponent {
  constructor(public templateService: TemplateService){}
  


}
