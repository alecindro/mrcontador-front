import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IContador, Contador } from 'app/shared/model/contador.model';
import { ContadorService } from './contador.service';
import { TelefoneDTO } from 'app/shared/dto/telefoneDTO';
import { ViaCepService } from 'app/shared/services/viacepservice';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'jhi-contador-update',
  templateUrl: './contador-update.component.html',
})
export class ContadorUpdateComponent implements OnInit {
  isSaving = false;
  maskJuridica = '00.000.000/0000-00';
  maskFisica = '000.000.000-00';
  mask = this.maskJuridica;
  _false = false;
  _true = true;

  telefoneDTOs: TelefoneDTO[] = [];
  sistemas: string[] = ['Dominio Sistemas'];
  editForm = this.fb.group({
    id: [],
    razao: ['', [Validators.required, Validators.maxLength(254)]],
    fantasia: ['', [Validators.maxLength(254)]],
    ddd: [],
    numero: [],
    logradouro: [],
    pessoafisica: [],
    datasource: [],
    cnpj: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(18)]],
    cidade: ['', [Validators.maxLength(254)]],
    estado: ['', [Validators.maxLength(254)]],
    cep: ['', [Validators.minLength(8), Validators.maxLength(10)]],
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    crc: ['', [Validators.required, Validators.maxLength(254)]],
    sistema: ['', [Validators.required]],
  });

  constructor(
    protected contadorService: ContadorService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private viacepService: ViaCepService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contador }) => {
      this.updateForm(contador);
      if (contador.telefones) this.telefoneDTOs = JSON.parse(contador.telefones);
    });
  }

  updateForm(contador: IContador): void {
    this.editForm.patchValue({
      id: contador.id,
      razao: contador.razao,
      fantasia: contador.fantasia,
      ddd: '',
      numero: '',
      datasource: contador.datasource,
      cnpj: contador.cnpj,
      cidade: contador.cidade,
      estado: contador.estado,
      cep: contador.cep,
      email: contador.email,
      crc: contador.crc,
      sistema: contador.sistema,
      pessoafisica: contador.pessoafisica ? this._true : this._false,
      logradouro: contador.logradouro,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contador = this.createFromForm();
    this.spinner.show();
    if (contador.id !== undefined) {
      this.subscribeToSaveResponse(this.contadorService.update(contador));
    } else {
      this.subscribeToSaveResponse(this.contadorService.create(contador));
    }
  }

  private createFromForm(): IContador {
    return {
      ...new Contador(),
      id: this.editForm.get(['id'])!.value,
      razao: this.editForm.get(['razao'])!.value,
      fantasia: this.editForm.get(['fantasia'])!.value,
      telefones: JSON.stringify(this.telefoneDTOs ? this.telefoneDTOs : ''),
      datasource: this.editForm.get(['datasource'])!.value,
      cnpj: this.editForm.get(['cnpj'])!.value,
      cidade: this.editForm.get(['cidade'])!.value,
      estado: this.editForm.get(['estado'])!.value,
      cep: this.editForm.get(['cep'])!.value,
      email: this.editForm.get(['email'])!.value,
      crc: this.editForm.get(['crc'])!.value,
      sistema: this.editForm.get(['sistema'])!.value,
      logradouro: this.editForm.get(['logradouro'])!.value,
      pessoafisica: this.editForm.get(['pessoafisica'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContador>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.spinner.hide();
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.spinner.hide();
    this.isSaving = false;
  }
  add(): void {
    const telefoneDTO = new TelefoneDTO();
    telefoneDTO.ddd = this.editForm.get(['ddd'])!.value;
    telefoneDTO.numero = this.editForm.get(['numero'])!.value;
    this.telefoneDTOs.push(telefoneDTO);
    this.editForm.patchValue({ ddd: '' });
    this.editForm.patchValue({ numero: '' });
  }
  remove(telefoneDTO: TelefoneDTO): void {
    this.telefoneDTOs = this.telefoneDTOs.filter(t1 => t1.ddd !== telefoneDTO.ddd || t1.numero !== telefoneDTO.numero);
  }
  edit(telefoneDTO: TelefoneDTO): void {
    this.editForm.patchValue({ ddd: telefoneDTO.ddd });
    this.editForm.patchValue({ numero: telefoneDTO.numero });
    this.remove(telefoneDTO);
  }

  onChange(): void {
    if (this.editForm.get(['pessoafisica'])!.value) {
      this.mask = this.maskFisica;
    } else {
      this.mask = this.maskJuridica;
    }
  }

  onCep(): void {
    if (this.editForm.get(['cep'])!.value) {
      this.spinner.show();
      this.viacepService.query(this.editForm.get(['cep'])!.value).subscribe(
        response => {
          this.editForm.patchValue({
            cidade: response.body?.localidade,
            estado: response.body?.uf,
            logradouro: response.body?.logradouro,
          });
          this.spinner.hide();
        },
        error => {
          console.log(error);
          this.spinner.hide();
        }
      );
    }
  }
}
