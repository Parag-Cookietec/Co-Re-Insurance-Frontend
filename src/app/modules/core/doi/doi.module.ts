import { CommonProtoModule } from './../../../common/common.module';
import { MaterialModule } from './../../../shared/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DoiRoutingModule } from './doi-routing.module';
import { JpaClaimEntryComponent, ValidationDialogComponent } from './jpa/jpa-claim-entry/jpa-claim-entry.component';

//import { ClaimNoteComponent } from './jpa/jpa-report/claim-note/claim-note.component';
//import { MemorandumComponent } from './jpa/jpa-report/memorandum/memorandum.component';
//import { NoClaimComponent } from './jpa/jpa-report/no-claim/no-claim.component';
//import { QueryGenerateComponent } from './jpa/jpa-report/query-generate/query-generate.component';
import { WorkflowDoiModuleComponent } from './workflow-doi-module/workflow-doi-module.component';
import { WorkflowDetailsLfComponent } from './workflow-details-lf/workflow-details-lf.component';
import { WorkflowDoiComponent } from './workflow-doi/workflow-doi.component';
import { JpaRejectionQueryDialogComponent } from './jpa/jpa-rejection-query-dialog/jpa-rejection-query-dialog.component';
import { JpaQueryDialogComponent } from './jpa/jpa-query-dialog/jpa-query-dialog.component';
//import { JpaSendForPaymentListingComponent } from './jpa/jpa-send-for-payment-listing/jpa-send-for-payment-listing.component';
//import { JpaRejectionListingComponent } from './jpa/jpa-rejection-listing/jpa-rejection-listing.component';
import { DocumentDialogComponent } from './jpa/jpa-claim-entry/document-dialog/document-dialog.component';

// Co-insurance Entry
import { IChequeRegisterComponent } from './i-cheque-register/i-cheque-register.component';
import { PremiumRegisterReInsuranceComponent } from './premium-register-re-insurance/premium-register-re-insurance.component';
import { PremiumRefundListingComponent } from './co-insurance/premium-refund-listing/premium-refund-listing.component';
import { PremiumRefundEntryComponent } from './co-insurance/premium-refund-entry/premium-refund-entry.component';
import { PremiumRefundMemorandumComponent } from './co-insurance/premium-refund-memorandum/premium-refund-memorandum.component';
import { PolicyEntryComponent } from './co-insurance/policy-entry/policy-entry.component';
import { PolicyEntryListingComponent } from './co-insurance/policy-entry-listing/policy-entry-listing.component';
import { IChequeRegisterListingComponent } from './i-cheque-register-listing/i-cheque-register-listing.component';
import { UploadProvisionComponent } from './co-insurance/policy-entry/upload-provision/upload-provision.component';
import { CoInsuranceClaimListingComponent } from './co-insurance/co-insurance-claim-listing/co-insurance-claim-listing.component';
import { CoInsuranceClaimEntryComponent } from './co-insurance/co-insurance-claim-entry/co-insurance-claim-entry.component';
import { CoInsuranceMemorandumComponent } from './co-insurance/co-insurance-memorandum/co-insurance-memorandum.component';
import { PremiumRegisterComponent } from './premium-register/premium-register.component';
import { ReInsurancePolicyMasterComponent } from './re-insurance-policy-master/re-insurance-policy-master.component';
import { RiClaimRecoveryComponent } from './ri-claim-recovery/ri-claim-recovery.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    MaterialModule,
    CommonProtoModule,
    DoiRoutingModule
  ],
  declarations: [

    //ClaimNoteComponent,
    //MemorandumComponent,
    // NoClaimComponent,
    // QueryGenerateComponent,
    JpaQueryDialogComponent,
    JpaRejectionQueryDialogComponent,
    WorkflowDoiComponent,
    WorkflowDetailsLfComponent,
    WorkflowDoiModuleComponent,
    DocumentDialogComponent,
    ValidationDialogComponent,
    //JpaRejectionListingComponent,
    //JpaSendForPaymentListingComponent,
    PremiumRegisterReInsuranceComponent,
    IChequeRegisterComponent,
    PremiumRefundListingComponent,
    PremiumRefundEntryComponent,
	  PremiumRefundMemorandumComponent,
    PolicyEntryComponent,
    PolicyEntryListingComponent,
    IChequeRegisterListingComponent,
    UploadProvisionComponent,
	  CoInsuranceClaimListingComponent,
	  CoInsuranceClaimEntryComponent,
	  CoInsuranceMemorandumComponent,
    PremiumRegisterComponent,
    ReInsurancePolicyMasterComponent,
    RiClaimRecoveryComponent
  ],
  entryComponents: [
    UploadProvisionComponent,
    WorkflowDoiModuleComponent
  ]
})
export class DoiModule { }
