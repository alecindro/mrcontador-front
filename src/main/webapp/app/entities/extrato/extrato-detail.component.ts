import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExtrato } from 'app/shared/model/extrato.model';

@Component({
  selector: 'jhi-extrato-detail',
  templateUrl: './extrato-detail.component.html',
})
export class ExtratoDetailComponent implements OnInit {
  extrato: IExtrato | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ extrato }) => (this.extrato = extrato));
  }

  previousState(): void {
    window.history.back();
  }
}
