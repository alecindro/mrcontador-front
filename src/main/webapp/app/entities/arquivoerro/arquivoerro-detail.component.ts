import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IArquivoerro } from 'app/model/arquivoerro.model';

@Component({
  selector: 'jhi-arquivoerro-detail',
  templateUrl: './arquivoerro-detail.component.html',
})
export class ArquivoerroDetailComponent implements OnInit {
  arquivoerro: IArquivoerro | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ arquivoerro }) => (this.arquivoerro = arquivoerro));
  }

  previousState(): void {
    window.history.back();
  }
}
