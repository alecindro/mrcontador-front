import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IParceiro, Parceiro } from '../../shared/model/parceiro.model';
import { ParceiroService } from './parceiro.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UploadService } from 'app/shared/file/file-upload.service ';

@Component({
  selector: 'jhi-parceiro-create',
  templateUrl: './parceiro-create.component.html',
  styleUrls: ['filecomponent.scss'],
})
export class ParceiroCreateComponent implements OnInit {
  progressInfo: any = {};
  message = '';
  error: any = {};
  uploadResponse = { status: '', message: '', percent: 0, filePath: '' };
  cnpj: any;
  isSaving = false;
  editable = true;

  maskJuridica = '00.000.000/0000-00';
  maskFisica = '000.000.000-00';
  mask = this.maskJuridica;

  juridica = 'J';
  fisica = 'F';

  editForm = this.fb.group({
    id: [],
    parDescricao: [null, [Validators.maxLength(50)]],
    parRazaosocial: [null, [Validators.maxLength(70), Validators.required]],
    parTipopessoa: [null, [Validators.maxLength(1)]],
    parCnpjcpf: [null, [Validators.maxLength(20), Validators.required]],
    parRgie: [null, [Validators.maxLength(20)]],
    parObs: [null, [Validators.maxLength(200)]],
    parDatacadastro: [],
    spaCodigo: [],
    logradouro: [],
    pessoafisica: [],
    cep: [null, [Validators.maxLength(8)]],
    cidade: [],
    estado: [],
    areAtuacao: [],
    numero: [],
    bairro: [],
    porte: [],
    abertura: [],
    naturezaJuridica: [],
    ultimaAtualizacao: [],
    status: [],
    tipo: [],
    complemento: [],
    email: [],
    telefone: [],
    dataSituacao: [],
    efr: [],
    motivoSituacao: [],
    situacaoEspecial: [],
    dataSituacaoEspecial: [],
    capitalSocial: [],
    areaAtuacao: [],
    enabled: [],
    atividades: this.fb.array([]),
    socios: this.fb.array([]),
  });

  constructor(
    protected parceiroService: ParceiroService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.mask = this.maskJuridica;
  }

  updateForm(parceiro: IParceiro): void {
    this.editForm.patchValue({
      id: parceiro.id,
      parDescricao: parceiro.parDescricao,
      parRazaosocial: parceiro.parRazaosocial,
      parTipopessoa: parceiro.parTipopessoa,
      parCnpjcpf: parceiro.parCnpjcpf,
      parRgie: parceiro.parRgie,
      parObs: parceiro.parObs,
      parDatacadastro: parceiro.parDatacadastro,
      spaCodigo: parceiro.spaCodigo,
      logradouro: parceiro.logradouro,
      cep: parceiro.cep,
      cidade: parceiro.cidade,
      estado: parceiro.estado,
      areAtuacao: parceiro.areAtuacao,
      numero: parceiro.numero,
      bairro: parceiro.bairro,
      porte: parceiro.porte,
      abertura: parceiro.abertura,
      naturezaJuridica: parceiro.naturezaJuridica,
      ultimaAtualizacao: parceiro.ultimaAtualizacao,
      status: parceiro.status,
      tipo: parceiro.tipo,
      complemento: parceiro.complemento,
      email: parceiro.email,
      telefone: parceiro.telefone,
      dataSituacao: parceiro.dataSituacao,
      efr: parceiro.efr,
      motivoSituacao: parceiro.motivoSituacao,
      situacaoEspecial: parceiro.situacaoEspecial,
      dataSituacaoEspecial: parceiro.dataSituacaoEspecial,
      capitalSocial: parceiro.capitalSocial,
      enabled: parceiro.enabled,
    });
    const _socios = this.editForm.controls.socios as FormArray;
    const _atividades = this.editForm.controls.atividades as FormArray;
    if (parceiro.socios) {
      parceiro.socios.forEach(socio => {
        _socios.push(
          this.fb.group({
            id: socio.id,
            descricao: socio.descricao,
            nome: socio.nome,
          })
        );
      });
    }
    if (parceiro.atividades) {
      parceiro.atividades.forEach(atividade => {
        _atividades.push(
          this.fb.group({
            id: atividade.id,
            descricao: atividade.descricao,
            code: atividade.code,
            tipo: atividade.tipo,
          })
        );
      });
    }
  }

  get socios(): FormArray {
    return this.editForm.get('socios') as FormArray;
  }
  get atividades(): FormArray {
    return this.editForm.get('atividades') as FormArray;
  }
  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parceiro = this.createFromForm();
    parceiro.enabled = true;
    this.spinner.show();
    this.subscribeToSaveResponse(this.parceiroService.create(parceiro));
  }

  saveClick(): void {
    if (this.editForm.dirty) {
      this.save();
    } else {
      this.previousState();
    }
  }

  private createFromForm(): IParceiro {
    return {
      ...new Parceiro(),
      id: this.editForm.get(['id'])!.value,
      parDescricao: this.editForm.get(['parDescricao'])!.value,
      parRazaosocial: this.editForm.get(['parRazaosocial'])!.value,
      parTipopessoa: this.editForm.get(['pessoafisica'])!.value ? this.fisica : this.juridica,
      parCnpjcpf: this.editForm.get(['parCnpjcpf'])!.value,
      parRgie: this.editForm.get(['parRgie'])!.value,
      parObs: this.editForm.get(['parObs'])!.value,
      parDatacadastro: this.editForm.get(['parDatacadastro'])!.value,
      spaCodigo: this.editForm.get(['spaCodigo'])!.value,
      logradouro: this.editForm.get(['logradouro'])!.value,
      cep: this.editForm.get(['cep'])!.value,
      cidade: this.editForm.get(['cidade'])!.value,
      estado: this.editForm.get(['estado'])!.value,
      areAtuacao: this.editForm.get(['areAtuacao'])!.value,
      numero: this.editForm.get(['numero'])!.value,
      bairro: this.editForm.get(['bairro'])!.value,
      porte: this.editForm.get(['porte'])!.value,
      abertura: this.editForm.get(['abertura'])!.value,
      naturezaJuridica: this.editForm.get(['naturezaJuridica'])!.value,
      ultimaAtualizacao: this.editForm.get(['ultimaAtualizacao'])!.value,
      status: this.editForm.get(['status'])!.value,
      tipo: this.editForm.get(['tipo'])!.value,
      complemento: this.editForm.get(['complemento'])!.value,
      email: this.editForm.get(['email'])!.value,
      telefone: this.editForm.get(['telefone'])!.value,
      dataSituacao: this.editForm.get(['dataSituacao'])!.value,
      efr: this.editForm.get(['efr'])!.value,
      motivoSituacao: this.editForm.get(['motivoSituacao'])!.value,
      situacaoEspecial: this.editForm.get(['situacaoEspecial'])!.value,
      dataSituacaoEspecial: this.editForm.get(['dataSituacaoEspecial'])!.value,
      capitalSocial: this.editForm.get(['capitalSocial'])!.value,
      enabled: this.editForm.get(['enabled'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParceiro>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.editable = false;
    this.spinner.hide();
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
    this.editable = true;
    this.spinner.hide();
  }

  onCnpj(): void {
    if (this.cnpj) {
      this.spinner.show();
      this.parceiroService.createByCnpj(this.cnpj).subscribe(
        response => {
          const parceiro: Parceiro = response.body || {};
          console.log(parceiro);
          this.updateForm(parceiro);
          this.isSaving = false;
          this.editable = false;
          this.spinner.hide();
        },
        error => {
          console.log(error);
          this.isSaving = false;
          this.editable = true;
          this.spinner.hide();
        }
      );
    }
  }

  selectFile(event: any): void {
    event.preventDefault();
    this.progressInfo = { value: 0, fileName: event.target.files[0].name, file: event.target.files[0] };
  }

  upload(): void {
    this.message = '';
    if (this.progressInfo.file) {
      this.spinner.show();
      this.uploadService.uploadFiles(this.progressInfo.file).subscribe(
        event => {
          if (event && event.type === HttpEventType.UploadProgress) {
            this.progressInfo.value = Math.round((100 * event.loaded) / event.total);
            this.progressInfo.file = undefined;
          } else if (event instanceof HttpResponse) {
            this.message = event.status.toString();
            this.updateForm(event.body);
            this.isSaving = false;
            this.editable = false;
            this.spinner.hide();
          }
        },
        err => {
          this.progressInfo.value = 0;
          this.isSaving = false;
          this.editable = true;
          this.message = 'Não foi possivel carregar o arquivo:' + err;
          this.spinner.hide();
        }
      );
    }
  }

  allowDrop(ev: any): void {
    ev.preventDefault();
  }

  drop(ev: any): void {
    ev.preventDefault();
    ev.target.files = ev.dataTransfer.files;
    this.selectFile(ev);
  }

  remove(): void {
    this.progressInfo.file = undefined;
    this.progressInfo = {};
  }
}
