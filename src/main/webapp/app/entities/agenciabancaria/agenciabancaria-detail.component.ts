import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AgenciabancariaDTO } from 'app/shared/model/agenciabancaria.model';

@Component({
  selector: 'jhi-agenciabancaria-detail',
  templateUrl: './agenciabancaria-detail.component.html',
})
export class AgenciabancariaDetailComponent implements OnInit {
  agenciabancaria: AgenciabancariaDTO | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agenciabancaria }) => (this.agenciabancaria = agenciabancaria));
  }

  previousState(): void {
    window.history.back();
  }
}
