import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INotaservico } from 'app/shared/model/notaservico.model';

@Component({
  selector: 'jhi-notaservico-detail',
  templateUrl: './notaservico-detail.component.html',
})
export class NotaservicoDetailComponent implements OnInit {
  notaservico: INotaservico | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notaservico }) => (this.notaservico = notaservico));
  }

  previousState(): void {
    window.history.back();
  }
}
