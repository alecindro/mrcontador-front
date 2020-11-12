import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IParceiro, Parceiro } from '../../model/parceiro.model';
import { ParceiroService } from '../../services/parceiro.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UploadService } from '../../services/file-upload.service';
import { JhiEventManager } from 'ng-jhipster';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { IConta } from '../../model/conta.model';
import { AgenciabancariaService } from 'app/services/agenciabancaria.service';

type EntityResponseType = HttpResponse<IParceiro>;
@Component({
  selector: 'jhi-parceiro-create',
  templateUrl: './parceiro-create.component.html',
  styleUrls: ['./parceiro-create.component.scss'],
})
export class ParceiroCreateComponent implements OnInit, OnDestroy {
  progressInfo: { value?: number; fileName?: string; file?: any; index?: number; _event?: any; message?: string; error?: boolean } = {};
  error: any = {};
  uploadResponse = { status: '', message: '', percent: 0, filePath: '' };
  cnpj: any;
  isSaving = false;
  editable = true;
  current_fs: any;
  next_fs: any;
  maskJuridica = '00.000.000/0000-00';
  maskFisica = '000.000.000-00';
  mask = this.maskJuridica;
  step = 0;
  parceiro?: IParceiro;
  juridica = 'J';
  fisica = 'F';
  despesaJurosConta?: IConta;
  despesaIofConta?: IConta;
  jurosAtivosConta?: IConta;
  descontosAtivosConta?: IConta;
  caixaConta?: IConta;
  despesasBancariasConta?: IConta;
  despesaTarifaConta?: IConta;
  codExt?: string;
  agenciaListener!: Subscription;
  agenciaSaved = false;

  formParceiro = this.fb.group({
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

  constructor(
    protected parceiroService: ParceiroService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private uploadService: UploadService,
    protected eventManager: JhiEventManager,
    public activeModal: NgbActiveModal,
    public translate: TranslateService,
    protected agenciaBancariaService: AgenciabancariaService
  ) {
    this.registerAgenciaListener();
  }

  ngOnInit(): void {
    if (this.parceiro) {
      this.updateForm(this.parceiro);
      this.step = this.parceiro.cadastroStatus! + 1;
    }
    this.mask = this.maskJuridica;
  }

  updateForm(parceiro: IParceiro): void {
    this.formParceiro.patchValue({
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
    const _socios = this.formParceiro.controls.socios as FormArray;
    const _atividades = this.formParceiro.controls.atividades as FormArray;
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
    return this.formParceiro.get('socios') as FormArray;
  }
  get atividades(): FormArray {
    return this.formParceiro.get('atividades') as FormArray;
  }

  save(): void {
    this.isSaving = true;
    const parceiro = this.createFromForm();
    parceiro.enabled = true;
    this.spinner.show();
    this.subscribeToSaveResponse(this.parceiroService.create(parceiro));
  }

  closeModal(): void {
    this.activeModal.close();
  }

  private createFromForm(): IParceiro {
    return {
      ...new Parceiro(),
      id: this.formParceiro.get(['id'])!.value,
      parDescricao: this.formParceiro.get(['parDescricao'])!.value,
      parRazaosocial: this.formParceiro.get(['parRazaosocial'])!.value,
      parTipopessoa: this.formParceiro.get(['pessoafisica'])!.value ? this.fisica : this.juridica,
      parCnpjcpf: this.formParceiro.get(['parCnpjcpf'])!.value,
      parRgie: this.formParceiro.get(['parRgie'])!.value,
      parObs: this.formParceiro.get(['parObs'])!.value,
      parDatacadastro: this.formParceiro.get(['parDatacadastro'])!.value,
      spaCodigo: this.formParceiro.get(['spaCodigo'])!.value,
      logradouro: this.formParceiro.get(['logradouro'])!.value,
      cep: this.formParceiro.get(['cep'])!.value,
      cidade: this.formParceiro.get(['cidade'])!.value,
      estado: this.formParceiro.get(['estado'])!.value,
      areAtuacao: this.formParceiro.get(['areAtuacao'])!.value,
      numero: this.formParceiro.get(['numero'])!.value,
      bairro: this.formParceiro.get(['bairro'])!.value,
      porte: this.formParceiro.get(['porte'])!.value,
      abertura: this.formParceiro.get(['abertura'])!.value,
      naturezaJuridica: this.formParceiro.get(['naturezaJuridica'])!.value,
      ultimaAtualizacao: this.formParceiro.get(['ultimaAtualizacao'])!.value,
      status: this.formParceiro.get(['status'])!.value,
      tipo: this.formParceiro.get(['tipo'])!.value,
      complemento: this.formParceiro.get(['complemento'])!.value,
      email: this.formParceiro.get(['email'])!.value,
      telefone: this.formParceiro.get(['telefone'])!.value,
      dataSituacao: this.formParceiro.get(['dataSituacao'])!.value,
      efr: this.formParceiro.get(['efr'])!.value,
      motivoSituacao: this.formParceiro.get(['motivoSituacao'])!.value,
      situacaoEspecial: this.formParceiro.get(['situacaoEspecial'])!.value,
      dataSituacaoEspecial: this.formParceiro.get(['dataSituacaoEspecial'])!.value,
      capitalSocial: this.formParceiro.get(['capitalSocial'])!.value,
      enabled: this.formParceiro.get(['enabled'])!.value,
      codExt: this.formParceiro.get(['codExt'])!.value,
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
    this.eventManager.broadcast('parceiroListModification');
    this.closeModal();
  }

  protected onSaveError(): void {
    this.isSaving = false;
    this.editable = true;
    this.spinner.hide();
  }

  onCnpj(): Observable<EntityResponseType> {
    return this.parceiroService.createByCnpj(this.cnpj);
  }

  updateParceiroConta(): Observable<EntityResponseType> {
    this.parceiro!.jurosAtivos = this.jurosAtivosConta || undefined;
    this.parceiro!.despesaJuros = this.despesaJurosConta || undefined;
    this.parceiro!.despesaIof = this.despesaIofConta || undefined;
    this.parceiro!.despesaTarifa = this.despesaTarifaConta || undefined;
    this.parceiro!.despesasBancarias = this.despesasBancariasConta || undefined;
    this.parceiro!.descontosAtivos = this.descontosAtivosConta || undefined;
    this.parceiro!.codExt = this.codExt || undefined;
    return this.parceiroService.update(this.parceiro!);
  }

  next($event: any): void {
    this.current_fs = $event.target.parentElement.parentElement;
    this.next_fs = this.current_fs.nextElementSibling;
    this.spinner.show();
    switch (this.step) {
      case 0:
        this.onCnpj().subscribe(
          response => {
            this.parceiro = response.body || {};
            this.isSaving = false;
            this.editable = false;
            this.eventManager.broadcast('parceiroListModification');
            this.spinner.hide();
            this.step = this.step + 1;
          },
          error => {
            console.log(error);
            this.isSaving = false;
            this.editable = true;
            this.spinner.hide();
          }
        );
        break;
      case 1:
        if (this.parceiro) {
          this.upload().subscribe(
            event => {
              if (event && event.type === HttpEventType.UploadProgress) {
                this.progressInfo.value = Math.round((100 * event.loaded) / event.total);
              } else if (event instanceof HttpResponse) {
                this.eventManager.broadcast('parceiroListModification');
                this.step = this.step + 1;
                this.parceiro = event.body;
                this.isSaving = false;
                this.editable = false;
                this.progressInfo.file = undefined;
                this.spinner.hide();
              }
            },
            err => {
              this.progressInfo.value = 0;
              this.isSaving = false;
              this.editable = true;
              this.progressInfo.message = this.translate.instant(err.error.message);
              this.progressInfo.error = true;
              this.spinner.hide();
            }
          );
        }
        break;
      case 2:
        this.updateParceiroConta().subscribe(
          response => {
            this.spinner.hide();
            this.eventManager.broadcast('parceiroListModification');
            this.parceiro = response.body || {};
            this.step = this.step + 1;
          },
          () => {
            this.spinner.hide();
          }
        );
        break;
      case 3:
        if (this.parceiro) {
          this.parceiroService.update(this.parceiro!).subscribe(
            response => {
              this.spinner.hide();
              this.eventManager.broadcast('parceiroListModification');
              this.parceiro = response.body || {};
              this.step = this.step + 1;
              this.updateForm(this.parceiro);
            },
            () => {
              this.spinner.hide();
            }
          );
          if (this.caixaConta) {
            this.caixaConta.parceiro = this.parceiro;
            this.agenciaBancariaService.createCaixa(this.caixaConta).subscribe(() => {});
          }
        }
        break;
      case 4:
        if (this.parceiro) {
          this.parceiroService.update(this.parceiro!).subscribe(
            response => {
              this.spinner.hide();
              this.eventManager.broadcast('parceiroListModification');
              this.parceiro = response.body || {};
              this.step = this.step + 1;
              this.closeModal();
            },
            () => {
              this.spinner.hide();
            }
          );
        }
        break;
      default:
        this.spinner.hide();
        break;
    }
  }

  selectFile(event: any): void {
    event.preventDefault();
    this.progressInfo = { value: 0, fileName: event.target.files[0].name, file: event.target.files[0] };
  }

  upload(): Observable<any> {
    const queryParam = {
      parceiroId: this.parceiro?.id,
    };
    return this.uploadService.uploadFiles(this.progressInfo.file, this.uploadService.planocontasUrl, queryParam);
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

  selectedCaixaConta(conta: IConta): void {
    this.caixaConta = conta;
  }
  selectedDescontosAtivosConta(conta: IConta): void {
    this.descontosAtivosConta = conta;
  }
  selectedDespesaJurosConta(conta: IConta): void {
    this.despesaJurosConta = conta;
  }
  selectedDespesaIofConta(conta: IConta): void {
    this.despesaIofConta = conta;
  }
  selectedJurosAtivosConta(conta: IConta): void {
    this.jurosAtivosConta = conta;
  }
  selectedDespesasBancariasConta(conta: IConta): void {
    this.despesasBancariasConta = conta;
  }
  selectedDespesaTarifaConta(conta: IConta): void {
    this.despesaTarifaConta = conta;
  }

  ngOnDestroy(): void {
    if (this.agenciaListener) {
      this.eventManager.destroy(this.agenciaListener);
    }
  }

  private registerAgenciaListener(): void {
    this.agenciaListener = this.eventManager.subscribe('agenciaListModification', () => {
      this.agenciaSaved = true;
    });
  }
}
