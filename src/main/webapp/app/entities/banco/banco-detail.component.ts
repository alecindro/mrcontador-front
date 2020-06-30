import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBanco } from 'app/shared/model/banco.model';

@Component({
  selector: 'jhi-banco-detail',
  templateUrl: './banco-detail.component.html',
})
export class BancoDetailComponent implements OnInit {
  banco: IBanco | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ banco }) => (this.banco = banco));
  }

  previousState(): void {
    window.history.back();
  }
}
