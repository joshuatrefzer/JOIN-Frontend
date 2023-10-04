import { Component, OnDestroy, OnInit } from '@angular/core';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  constructor(public templateService: TemplateService) { }
  ngOnInit(): void {
    this.templateService.board = true;
  }

  ngOnDestroy(): void {
    this.templateService.board = false;

  }

}
