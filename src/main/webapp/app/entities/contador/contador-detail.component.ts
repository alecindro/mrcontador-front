import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IContador } from 'app/shared/model/contador.model';

@Component({
  selector: 'jhi-contador-detail',
  templateUrl: './contador-detail.component.html',
})
export class ContadorDetailComponent implements OnInit {
  contador: IContador | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contador }) => (this.contador = contador));
  }

  previousState(): void {
    window.history.back();
  }
}
