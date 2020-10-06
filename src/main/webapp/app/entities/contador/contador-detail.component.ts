import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IContador } from 'app/model/contador.model';
import { JsonUtil } from 'app/shared/util/json-util';

@Component({
  selector: 'jhi-contador-detail',
  templateUrl: './contador-detail.component.html',
})
export class ContadorDetailComponent implements OnInit {
  contador: IContador | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contador }) => {
      contador.telefones = JsonUtil.telefonesToString(contador.telefones);
      this.contador = contador;
    });
  }
  previousState(): void {
    window.history.back();
  }
}
