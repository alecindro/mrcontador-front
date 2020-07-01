import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRegra } from 'app/shared/model/regra.model';

@Component({
  selector: 'jhi-regra-detail',
  templateUrl: './regra-detail.component.html',
})
export class RegraDetailComponent implements OnInit {
  regra: IRegra | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ regra }) => (this.regra = regra));
  }

  previousState(): void {
    window.history.back();
  }
}
