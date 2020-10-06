import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAtividade } from 'app/model/atividade.model';

@Component({
  selector: 'jhi-atividade-detail',
  templateUrl: './atividade-detail.component.html',
})
export class AtividadeDetailComponent implements OnInit {
  atividade: IAtividade | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ atividade }) => (this.atividade = atividade));
  }

  previousState(): void {
    window.history.back();
  }
}
