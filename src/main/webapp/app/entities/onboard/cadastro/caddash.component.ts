import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { IParceiro, Parceiro } from '../../../model/parceiro.model';
import { ParceiroService } from '../../../services/parceiro.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

@Component({
  selector: 'jhi-caddash',
  templateUrl: './caddash.component.html',
  styleUrls: ['./caddash.component.scss'],
})
export class CadDashComponent implements OnInit {
  progressInfo: any = {};
  message = '';
  error: any = {};
  uploadResponse = { status: '', message: '', percent: 0, filePath: '' };
  cnpj: any;
  isSaving = false;
  parceiroListener!: Subscription;
  maskJuridica = '00.000.000/0000-00';
  maskFisica = '000.000.000-00';
  mask = this.maskJuridica;
  juridica = 'J';
  fisica = 'F';

  editForm!: FormGroup;

  constructor(
    protected parceiroService: ParceiroService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit(): void {
    this.mask = this.maskJuridica;
    this.updateForm(this.parceiroService.getParceiroSelected());
    this.parceiroListener = this.eventManager.subscribe('parceiroSelected', (response: JhiEventWithContent<Parceiro>) => {
      this.updateForm(response.content);
    });
  }

  createForm(): void {
    this.editForm = this.fb.group({
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
      codExt: [],
      atividades: this.fb.array([]),
      socios: this.fb.array([]),
    });
  }

  updateForm(parceiro: IParceiro): void {
    this.createForm();
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
      codExt: parceiro.codExt,
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
    setTimeout(() => this.editForm.disable(), 500);
  }

  get socios(): FormArray {
    return this.editForm.get('socios') as FormArray;
  }
  get atividades(): FormArray {
    return this.editForm.get('atividades') as FormArray;
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
    }
    this.edit();
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
      codExt: this.editForm.get(['codExt'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParceiro>>): void {
    result.subscribe(
      response => this.onSaveSuccess(response),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(response: any): void {
    this.isSaving = false;
    this.spinner.hide();
    this.eventManager.broadcast(new JhiEventWithContent('parceiroSelected', response.body));
  }

  protected onSaveError(): void {
    this.isSaving = false;
    this.spinner.hide();
  }

  edit(): void {
    setTimeout(() => (this.editForm.disabled ? this.editForm.enable() : this.editForm.disable()), 500);
  }
}
