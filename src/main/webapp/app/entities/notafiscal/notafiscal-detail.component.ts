import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INotafiscal } from 'app/shared/model/notafiscal.model';

@Component({
  selector: 'jhi-notafiscal-detail',
  templateUrl: './notafiscal-detail.component.html',
})
export class NotafiscalDetailComponent implements OnInit {
  notafiscal: INotafiscal | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notafiscal }) => (this.notafiscal = notafiscal));
  }

  previousState(): void {
    window.history.back();
  }
}
