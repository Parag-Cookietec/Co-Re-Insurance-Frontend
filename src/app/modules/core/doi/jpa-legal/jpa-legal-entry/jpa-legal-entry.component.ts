import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { jpaMessage } from 'src/app/common/error-message/common-message.constants';
import { ToastrService } from 'ngx-toastr';
import { ListValue, AttachmentData, JpaLegal, OtherPayment, JpaLegalDetails, MasterEntry } from 'src/app/models/doi/doiModel';
import { DoiDirectives } from 'src/app/modules/core/common/directive/doi';
import { DoiService } from '../../service/doi.service';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { JpaUtilityService } from '../../service/jpa-utility.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-jpa-legal-entry',
  templateUrl: './jpa-legal-entry.component.html',
  styleUrls: ['./jpa-legal-entry.component.css']
})
export class JpaLegalEntryComponent implements OnInit {

  todayDate = new Date();
  // Form Group
  jpaLegalEntry: FormGroup;
  // List
  schemeType_list:ListValue[] = [];
    
  courtDetails_list: ListValue[] = [
    { value: '0', viewValue: 'District Commission' },
    { value: '2', viewValue: 'State Commission' },
    { value: '3', viewValue: 'National Commission' },

  ];
  districtList: ListValue[] = [
    { value: '0', viewValue: 'Ahmedabad' },
    { value: '1', viewValue: 'Amreli' },
    { value: '2', viewValue: 'Anand' },
    { value: '3', viewValue: 'Aravalli' },
    { value: '4', viewValue: 'Banaskantha' },
    { value: '5', viewValue: 'Bharuch' },
    { value: '6', viewValue: 'Bhavnagar' },
  ];
  attachmentTypeCode: any[] = [
    { value: '01', viewValue: 'Supporting Document' },
    { value: '02', viewValue: 'Sanction Order' },
    { value: '03', viewValue: 'Others' },
    // { type: 'view' }
  ];

  orderStatusList: ListValue[] = [
    { value: '0', viewValue: 'Pending' },
    { value: '2', viewValue: 'Opened' },
  ];


  courtTypeList: ListValue[] = [
    { value: '1', viewValue: 'Civil' },
    { value: '2', viewValue: 'Criminal' },
  ];

  appealPaidList: ListValue[] = [
    { value: '1', viewValue: 'Appeal' },
    { value: '2', viewValue: 'Paid' },
    { value: '3', viewValue: 'Not to Paid (Win)' },
  ];
  payModeList: ListValue[] = [
    { value: '1', viewValue: 'E-payment.' },
    { value: '2', viewValue: 'Cheque' },
    { value: '3', viewValue: 'DD' },
  ];

  // control
  districtCtrl: FormControl = new FormControl();
  schemeTypeCtrl: FormControl = new FormControl();
  errorMessage: any;
  courtDetailsCtrl: FormControl = new FormControl();
  orderStatusCtrl: FormControl = new FormControl();
  appealPaidCtrl: FormControl = new FormControl();
  payModeCtrl: FormControl = new FormControl();
  courtTypeCtrl: FormControl = new FormControl();
  directiveObject = new DoiDirectives(this.router, this.dialog);

  fileBrowseIndex: any;
  amountProposedData: any;
  selectedIndex: number;

  // Table Source

  Element_Data: any[] = [
    { payMode: '', refNo: '', chNo: '', ddNo: '', date: '', amt: '', remarks: '', },

  ];

  displayedOtherColumns: any[] = [
    'srno',
    'payMode',
    'refNo',
    'chNo',
    'ddNo',
    'date',
    'amt',
    'remarks',
    'action'
  ];

  dataSourceOther = new MatTableDataSource<any>(this.Element_Data);
  referenceNumer: string;

  constructor(private router: Router,private route: ActivatedRoute, private el: ElementRef,
    public dialog: MatDialog, private fb: FormBuilder, private toastr: ToastrService,
     private workflowService: DoiService, private datePipe: DatePipe,private jpaUtilityService: JpaUtilityService) { }

  ngOnInit() {
    this.errorMessage = jpaMessage;
    this.selectedIndex = 0;

    this.jpaLegalEntry = this.fb.group({
      inwardNo: [''],
      inwardDate: [''],
      caseNo: [''],
      applicantName: [{ value: '', disabled: true }],
      claimNo: [''],
      dateOfAccident: [{ value: '', disabled: true }],
      schemeType: [{ value: '', disabled: true }],
      district: [{ value: '', disabled: true }],
      courtCaseDate: [''],
      policyNo: [{ value: '', disabled: true }],
      courtDetails: [''],
      courtDesc: [''],
      nameOfDese: [{ value: '', disabled: true }],
      dateAcc: [''],
      detailOfQuery: [''],
      replyVal: [''],
      replayDate: [''],
      orderRecdDate: [''],
      orderStatus: [''],
      appealPaid: [''],
      appealPaid1: [''],
      appealPaid2: [''],
      appealPaid3: [''],
      depositChequeNo: [''],
      depositDate: [''],
      depositAmount: [''],
      paidChequeNo: [''],
      paidDate: [''],
      paidAmount: [''],
      depositRefundChequeNo: [''],
      depositRefundDate: [''],
      depositRefundAmount: [''],
      appealAdmitDate: [''],
      cmaNo: [''],
      rpAdmitDate: [''],
      appealNo: [''],
      revisionPetitionNo: [''],
      remarks: [''],
      payMode: [''],
      refNo: [''],
      ddNo: [''],
      courtType: [''],
      remark: [''],
      remarkReq: [''],
      referenceDt:['']
    });
    this.referenceNumer = this.jpaUtilityService.getNewPolicyNumber();
    this.getDistrictList();
    this.getMasterSchemeListing(new MasterEntry());
    this.setFormData();
  }
  getDistrictList() {
    this.workflowService.getDataWithoutParams(APIConst.GET_DOI_DISTRICT_LIST).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.schemeId;
            data.viewValue = element.schemeName;
            this.districtList.push(data);
          });
        }
      },
      err => {

      }
    );
  }
  private getMasterSchemeListing(payload: MasterEntry) {
    this.workflowService.getDataPost(payload, APIConst.DOI_JPA_MASTER_SCHEME_LISTING).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.schemeId;
            data.viewValue = element.schemeName;
            this.schemeType_list.push(data);
          });
        }
      },
      err => {

      }
    );
  }

  // Add record
  addRecord() {
    const p_data = this.dataSourceOther.data;
    p_data.push({
      updateBy: '',
      disp: true
    });
    this.dataSourceOther.data = p_data;
  }

  deleteRecord(index) {
    this.dataSourceOther.data.splice(index, 1);
    this.dataSourceOther = new MatTableDataSource(
      this.dataSourceOther.data
    );
  }


  openFileSelector(index) {
    this.el.nativeElement.querySelector('#fileBrowse').click();
    this.fileBrowseIndex = index;
  }

  onBrowseSelectChange() { }


  navigate() {
    console.log("Navigating to listing")
    this.router.navigate(['./dashboard/doi/jpa-legal-entry-listing']);
  }
  getTabIndex(tabIndex) {
    this.selectedIndex = tabIndex;
    console.log(this.selectedIndex);

  }

  onEnteringClaimNumber() {
   let jpaClaimId = this.jpaLegalEntry.controls.claimNo.value;
    this.workflowService.getDataWithoutParams(APIConst.DOI_JPA_GET_LEGAL_ENTRY_BY_CLIAM_ID+jpaClaimId)
    
    .subscribe( (data:any) => {
      let response : JpaLegal = data.result;
      let schemeValue = this.schemeType_list.filter(x => x.value+''===''+ response.schemeId);
      let scheme = schemeValue.length<=0 ?'': schemeValue[0].viewValue;
      let district1 = this.districtList.filter(x => x.value+''===''+  response.districtId);
      let district = district1.length <=0 ? '': district1[0].viewValue;
  
      this.jpaLegalEntry.patchValue({
        policyNo: response.policyNum,
        schemeType:scheme,
        district: district,
        applicantName:response.applicantName,
        nameOfDese: response.personName,
        dateOfAccident: new Date(response.dateOfAccident),
        
      });
       
    })
  }

  saveData() {
    let jpaLegalEntr :JpaLegalDetails = new JpaLegalDetails();
    let payload: JpaLegal = new JpaLegal();
    
    let doiJpaLegalOthrPaymentDTO: OtherPayment = new OtherPayment();
    jpaLegalEntr.inwardNo = this.jpaLegalEntry.controls.inwardNo.value;
    jpaLegalEntr.inwardDt= this.dateFormatter(this.jpaLegalEntry.controls.inwardDate.value,'dd-MMM-yyyy');
    jpaLegalEntr.jpaClaimId = this.jpaLegalEntry.controls.claimNo.value;
    jpaLegalEntr.referenceNo = this.referenceNumer;
    jpaLegalEntr.referenceDt = this.todayDate;

    payload.district= this.jpaLegalEntry.controls.district.value;
    payload.courtCaseNo= this.jpaLegalEntry.controls.caseNo.value;
    payload.courtCaseDt= this.dateFormatter(this.jpaLegalEntry.controls.courtCaseDate.value,'dd-MMM-yyyy');
    payload.claimNumber= this.jpaLegalEntry.controls.claimNo.value;
    payload.policyNum= this.jpaLegalEntry.controls.policyNo.value;
    payload.schemeId=  this.jpaLegalEntry.controls.schemeType.value;
    payload.applicantName= this.jpaLegalEntry.controls.applicantName.value;
    payload.deadPersonName= this.jpaLegalEntry.controls.nameOfDese.value;
    payload.accidentDeathDt= this.dateFormatter(this.jpaLegalEntry.controls.dateOfAccident.value,'dd-MMM-yyyy');
	  payload.appealAdmtDt= this.dateFormatter(this.jpaLegalEntry.controls.appealAdmitDate.value,'dd-MMM-yyyy');
    payload.queryDetails= this.jpaLegalEntry.controls.detailOfQuery.value;
    payload.replyDetails= this.jpaLegalEntry.controls.replyVal.value;
    payload.replayDt= this.dateFormatter(this.jpaLegalEntry.controls.replayDate.value,'dd-MMM-yyyy');
    payload.courtDecision= this.jpaLegalEntry.controls.courtDesc.value;
    payload.courtOrderDt = this.dateFormatter(this.jpaLegalEntry.controls.orderRecdDate.value, 'dd-MMM-yyyy');
    payload.rpAdmtDt=this.dateFormatter( this.jpaLegalEntry.controls.rpAdmitDate.value,'dd-MMM-yyyy');
    payload.appealNo= this.jpaLegalEntry.controls.appealNo.value;
    payload.revPetitionNo= this.jpaLegalEntry.controls.revisionPetitionNo.value;
    payload.orderStatus= this.jpaLegalEntry.controls.orderStatus.value;
	  payload.orderStatusId = this.jpaLegalEntry.controls.orderStatus.value;
    payload.appealPaidId=  this.jpaLegalEntry.controls.appealPaid.value;
    payload.paymentModeId=  this.jpaLegalEntry.controls.payMode.value;
    payload.ddNo= this.jpaLegalEntry.controls.ddNo.value;
    payload.paidDate= this.dateFormatter(this.jpaLegalEntry.controls.paidDate.value,'dd-MMM-yyyy');
    payload.paymentAmount= this.jpaLegalEntry.controls.paidAmount.value;
    payload.commissionType = 'External';
    payload.appealPaidId = 
    payload.appealRemarks = this.jpaLegalEntry.controls.remark.value;
    payload.cmaNo =this.jpaLegalEntry.controls.cmaNo.value;
    payload.courtTypeId = 
    payload.courtTypeId = this.jpaLegalEntry.controls.paidAmount.value;
    doiJpaLegalOthrPaymentDTO.paymentModeId= this.jpaLegalEntry.controls.payMode.value;
    doiJpaLegalOthrPaymentDTO.referenceNo= this.jpaLegalEntry.controls.refNo.value;
    doiJpaLegalOthrPaymentDTO.paidChequeNo= this.jpaLegalEntry.controls.paidChequeNo.value;
    doiJpaLegalOthrPaymentDTO.ddNo= this.jpaLegalEntry.controls.ddNo.value;
    doiJpaLegalOthrPaymentDTO.paidDate= this.dateFormatter(this.jpaLegalEntry.controls.paidDate.value,'dd-MMM-yyyy');
    doiJpaLegalOthrPaymentDTO.paymentAmount= this.jpaLegalEntry.controls.paidAmount.value;
    doiJpaLegalOthrPaymentDTO.remarks= this.jpaLegalEntry.controls.remarkReq.value;
    doiJpaLegalOthrPaymentDTO.commissionType = 'External',
    payload.doiJpaLegalOthrPaymentDTO[0]= doiJpaLegalOthrPaymentDTO;
    jpaLegalEntr.jpaLegalDtlDTO[0] = payload;
    this.workflowService.saveDocumentsData(APIConst.DOI_JPA_LEGAL_ENTRY, jpaLegalEntr).subscribe(
      (data) => {},
      error => {

      }
    );
  }
  dateFormatter(date:string, pattern: string) {
    if(date !== undefined) {
      try {
        return this.datePipe.transform(new Date(date), pattern);
        } catch(Exception ) {
  
        }
    }
  }
  fethcOrderStatusId(orderstatus:any) {
    let status = this.orderStatusList.filter(x => x.viewValue === orderstatus);
    return status.length <=0 ? 0 : status[0].value;
  }
  private setFormData() {

    let payload: any = this.jpaUtilityService.getSelectedJpaApprovedData();
    console.log('payload' + payload);
    this.referenceNumer = payload.claimNumber;
    this.workflowService.getDataWithoutParams(APIConst.DOI_JPA_LEGAL_ENTRY+'/'+payload.legalEntryId)
    .subscribe((resp:any) => {
      if(resp !== undefined && resp.status === 200 ) {
        console.log("data"+ resp);
        payload = resp;
        let entry = payload.result;
    payload = payload.result.jpaLegalDtlDTO[0];
    let schemeSelected = this.schemeType_list.filter(x => x.value === ''+payload.schemeId);
    let schemeType = schemeSelected.length <= 0 ? '' : schemeSelected[0].viewValue;
    let orderList = this.orderStatusList.filter(x => x.value === ''+payload.orderStatusId);
    let orderStatus = orderList.length <= 0 ? '' : orderList[0].viewValue;
    let courtDetail = this.courtDetails_list.filter(x => x.value === ''+payload.courtTypeId);
    let courtDetails = courtDetail.length <= 0 ? '' : courtDetail[0].viewValue;
    let payModes = this.payModeList.filter(x => x.value === payload.paidPaymntModeId);
    let payMode = payModes.length <= 0 ? '' : payModes[0].viewValue;
    this.jpaLegalEntry.patchValue({
      'applicantName': payload.applicantName,
      'claimNo':  payload.claimNumber,
      'courtCaseDate':  this.dateFormatter(payload.courtCaseDt,"dd/MM/yyyy"),
      'caseNo':  payload.courtCaseNo,
      'courtDecision':  payload.courtDecision,
      'courtDetail': courtDetails,
      'courtTypeId':  payload.courtTypeId,
      'createModeON':  payload.createModeON,
      'dateOfAccident': this.dateFormatter(payload.accidentDeathDt,"dd/MM/yyyy"),
      'detailOfQuery':  payload.queryDetails,
      'district':  payload.district,
      'inwardDate': entry.inwardDt,
      'inwardNo': entry.inwardNo  ,
      'modifyModeON':  payload.modifyModeON,
      'nameOfDese':  payload.deadPersonName,
      'orderStatus':  orderStatus,
      'orderStatusId': payload.orderStatusId,
      'policyNo':  payload.policyNum,
      'schemeType':  schemeType,
      'status':  payload.status,
	  'replyVal': payload.replyDetails,
	  'replayDate':this.dateFormatter(payload.replayDt,"dd/MM/yyyy"),
	  'courtDesc': payload.courtDecision,
	  'orderRecdDate': this.dateFormatter(payload.courtOrderDt,"dd/MM/yyyy"),
	  'appealPaid': payload.appealPaidId,
	  'remark': payload.appealRemarks,
	  'remarkReq':payload.appealRemarks,
	  'appealAdmitDate':payload.appealAdmtDt,
	  'cmaNo':payload.cmaNo,
	  'appealNo':payload.appealNo,
	  'rpAdmitDate':payload.rpAdmtDt,
	  'revisionPetitionNo':payload.revPetitionNo,
	  'depositChequeNo': payload.paidPaymntModeId,
      })
      }
    });
    
}

}
