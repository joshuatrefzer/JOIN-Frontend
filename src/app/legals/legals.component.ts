import { Component, OnDestroy, OnInit } from '@angular/core';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-legals',
  templateUrl: './legals.component.html',
  styleUrls: ['./legals.component.scss']
})
export class LegalsComponent implements OnInit, OnDestroy{
  constructor(public templateService: TemplateService){}
  
  ngOnInit(): void {
      this.templateService.legals = true;
  }

  ngOnDestroy(): void {
    this.templateService.legals = false;
  }


}
