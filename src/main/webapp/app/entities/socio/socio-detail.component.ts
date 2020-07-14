import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISocio } from 'app/shared/model/socio.model';

@Component({
  selector: 'jhi-socio-detail',
  templateUrl: './socio-detail.component.html',
})
export class SocioDetailComponent implements OnInit {
  socio: ISocio | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ socio }) => (this.socio = socio));
  }

  previousState(): void {
    window.history.back();
  }
}
