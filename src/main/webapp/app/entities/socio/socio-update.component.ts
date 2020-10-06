import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ISocio, Socio } from 'app/model/socio.model';
import { SocioService } from '../../services/socio.service';
import { IParceiro } from 'app/model/parceiro.model';
import { ParceiroService } from 'app/services/parceiro.service';

@Component({
  selector: 'jhi-socio-update',
  templateUrl: './socio-update.component.html',
})
export class SocioUpdateComponent implements OnInit {
  isSaving = false;
  parceiros: IParceiro[] = [];

  editForm = this.fb.group({
    id: [],
    descricao: [],
    nome: [],
    parceiro: [null, Validators.required],
  });

  constructor(
    protected socioService: SocioService,
    protected parceiroService: ParceiroService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ socio }) => {
      this.updateForm(socio);

      this.parceiroService.query().subscribe((res: HttpResponse<IParceiro[]>) => (this.parceiros = res.body || []));
    });
  }

  updateForm(socio: ISocio): void {
    this.editForm.patchValue({
      id: socio.id,
      descricao: socio.descricao,
      nome: socio.nome,
      parceiro: socio.parceiro,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const socio = this.createFromForm();
    if (socio.id !== undefined) {
      this.subscribeToSaveResponse(this.socioService.update(socio));
    } else {
      this.subscribeToSaveResponse(this.socioService.create(socio));
    }
  }

  private createFromForm(): ISocio {
    return {
      ...new Socio(),
      id: this.editForm.get(['id'])!.value,
      descricao: this.editForm.get(['descricao'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      parceiro: this.editForm.get(['parceiro'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISocio>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IParceiro): any {
    return item.id;
  }
}
