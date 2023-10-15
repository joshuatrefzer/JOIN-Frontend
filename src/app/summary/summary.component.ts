import { Component, OnDestroy, OnInit } from '@angular/core';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {

  constructor(public templateService: TemplateService) { }
  ngOnInit(): void {
    this.templateService.summary = true;
  }

  ngOnDestroy(): void {
    this.templateService.summary = false;

  }

  
}
