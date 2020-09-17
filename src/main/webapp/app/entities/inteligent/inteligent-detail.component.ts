import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInteligent } from 'app/shared/model/inteligent.model';

@Component({
  selector: 'jhi-inteligent-detail',
  templateUrl: './inteligent-detail.component.html',
})
export class InteligentDetailComponent implements OnInit {
  inteligent: IInteligent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ inteligent }) => (this.inteligent = inteligent));
  }

  previousState(): void {
    window.history.back();
  }
}
