import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParceiro } from 'app/model/parceiro.model';

@Component({
  selector: 'jhi-parceiro-detail',
  templateUrl: './parceiro-detail.component.html',
})
export class ParceiroDetailComponent implements OnInit {
  parceiro: IParceiro | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parceiro }) => (this.parceiro = parceiro));
  }

  previousState(): void {
    window.history.back();
  }
}
