import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { jpaMessage } from 'src/app/common/error-message/common-message.constants';
import { ToastrService } from 'ngx-toastr';
import { ListValue, JPLLegalReq } from 'src/app/models/doi/doiModel';
import { DatePipe } from '@angular/common';
import { DoiService } from '../../service/doi.service';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { JpaUtilityService } from '../../service/jpa-utility.service';

@Component({
  selector: 'app-jpa-legal-entry-for-request-listing',
  templateUrl: './jpa-legal-entry-for-request-listing.component.html',
  styleUrls: ['./jpa-legal-entry-for-request-listing.component.css']
})
export class JpaLegalEntryForRequestListingComponent implements OnInit {

  todayDate = new Date();
  // Form Group
  jpaLegalEntry: FormGroup;
  // List
  schemeType_list: ListValue[] = [
    {
      value: '1', viewValue: 'Registered Farmer'
    },
    { value: '2', viewValue: 'ITI Students ' },
    { value: '3', viewValue: 'Unorganised Landless Labours    ' },
    { value: '4', viewValue: ' Secondary and Higher Secondary Student ' },
    { value: '5', viewValue: ' Nominee of Registered Farmer  ' },
    { value: '6', viewValue: '  Primary School Student ' },
    { value: '7', viewValue: 'Safai Kamdar' },
    { value: '8', viewValue: 'Orphan Widows  ' },
    { value: '9', viewValue: 'Sports Hostel Trainees  ' },
    { value: '10', viewValue: ' Hira Udhyog Workers' },
    { value: '11', viewValue: ' Handicapped Person ' },
    { value: '12', viewValue: 'Police Personnel DYSP and above ' },
    { value: '13', viewValue: 'Police Personnel PI and PSI and PSO ' },
    { value: '14', viewValue: 'Police Personnel Head Constable and Constable    ' },
    { value: '16', viewValue: 'Police Personnel ATS and Bomb Squad  ' },
    { value: '17', viewValue: 'Police Personnel CM Security and Chetak Commando' },
    { value: '18', viewValue: 'All Jail Guards ' },
    { value: '19', viewValue: 'All uniformed employee of Jail Dept Other than Jail Guards' },
    { value: '20', viewValue: 'Pilgrim of Kailash Mansarovar' },
    { value: '21', viewValue: 'Pilgrim of Amarnath' },
    { value: '22', viewValue: 'Participants of Adventurous Activities' },
    { value: '23', viewValue: 'Shahid Veer Kinarivbrala College Student' },
  ];
  courtDetails_list: ListValue[] = [
    { value: '1', viewValue: 'Forum' },
    { value: '2', viewValue: 'State Commission' },
    { value: '3', viewValue: 'National Commission' },


  ];
  districtList: ListValue[] = [
    { value: '0', viewValue: 'Ahmedabad' },
    { value: '45', viewValue: 'Amreli' },
    { value: '02', viewValue: 'Anand' },
    { value: '03', viewValue: 'Aravalli' },
    { value: '04', viewValue: 'Banaskantha' },
    { value: '05', viewValue: 'Bharuch' },
    { value: '06', viewValue: 'Bhavnagar' },
  ];
  attachmentTypeCode: any[] = [
    { value: '01', viewValue: 'Supporting Document' },
    { value: '02', viewValue: 'Sanction Order' },
    { value: '03', viewValue: 'Others' },
    // { type: 'view' }
  ];
  // control
  districtCtrl: FormControl = new FormControl();
  schemeTypeCtrl: FormControl = new FormControl();
  errorMessage: any;
  courtDetailsCtrl: FormControl = new FormControl();
  // Table Source

  Element_Data: any[] = [

    {
      srno: '1',
      district: 'Morbi',
      courtCaseNo: '	1234',
      courtCaseDate: '	25/10/2019',
      courtDetail: '	Forum',
      claimId: '	JPA/KK/1004455',
      ploicyNo: '	DOI/JPA/KK/10000',
      scheme: '	Khatedar Khedut	',
      applicantName: 'Maganbhai Chhanabhai Patel	',
      detailofQuery: '',
      nameofDeceasedPerson: 'Chhanabhai Jinabhai Patel',
      dateOfAci: '	26/04/2019	',
      courtDecision: 'Pending Case	 ',
      createModeON: '22-Apr-2018 12:22PM',
      modifyModeON: '22-Jun-2018 01:22PM',
      status: 'Request Not accepted',
      action: '',
    },
    {
      srno: '2',
      district: 'Ahmedabad	',
      courtCaseNo: '	2345',
      courtCaseDate: '	1/11/2019	',
      courtDetail: '	Forum',
      claimId: '		JPA/RF/1003455	',
      ploicyNo: '	DOI/JPA/RF/10000',
      scheme: '		Register Farmer		',
      applicantName: 'Hiralal Ravjibhai Patel	',
      detailofQuery: '	Ravjibhai Lalbhai Patel',
      nameofDeceasedPerson: 'Ravjibhai Lalbhai Patel',
      dateOfAci: '	10/2/2019	',
      courtDecision: 'Pending Case	 ',
      createModeON: '12-Apr-2018 12:22PM',
      modifyModeON: '01-Jun-2018 01:22PM',
      status: 'Request Not accepted',
      action: '',
    },

    {
      srno: '3',
      district: 'Jamngar',
      courtCaseNo: '		4567',

      courtCaseDate: '28/10/2019',
      courtDetail: '		State Commission',
      claimId: '		JPA/UOL/1000345	',
      ploicyNo: '	DOI/JPA/UOL/10000',
      scheme: '		Unorganized Labour		',
      applicantName: 'Rambhai Ratanbhai Parmar	',
      detailofQuery: '	',
      nameofDeceasedPerson: '	Ratanbhai Ravjibhai Parmar',
      dateOfAci: '			13/08/2019	',
      courtDecision: 'Forum Decision favour on DOI',
      createModeON: '22-Apr-2018 12:22PM',
      modifyModeON: '2-Jun-2018 01:22PM',
      status: 'Approve',
      action: '',
    },

  ];
  displayedColumns: any[] = [
    'srno',
    'courtCaseNo',
    'courtCaseDate',
    'claimId',
    'ploicyNo',
    'district',
    'applicantName',
    'nameofDeceasedPerson',
    'dateOfAci',
    'createModeON',
    'modifyModeON',
    'status',
    'action'

  ];

  dataSource = new MatTableDataSource<any>(this.Element_Data);


  constructor(private router: Router, private el: ElementRef,
    public dialog: MatDialog, private fb: FormBuilder, private toastr: ToastrService,
    private workflowService : DoiService,private datePipe: DatePipe, private jpaUtilityService: JpaUtilityService) { }

  ngOnInit() {
    this.errorMessage = jpaMessage;

    this.jpaLegalEntry = this.fb.group({
      inwardNo: [''],
      inwardDate: [''],
      caseNo: [''],
      applicantName: [''],
      claimNo: [''],
      dateOfAccident: [''],
      schemeType: [''],
      district: [''],
      courtCaseDate: [''],
      policyNo: [''],
      courtDetails: [''],
      courtDesc: [''],
      nameOfDese: [''],
      dateAcc: [''],
      detailOfQuery: ['']
    });
    this.fetchListingData();
  }
  // Route Link
  navigate() {
    this.router.navigate(['./doi/jpa-legal-entry-for-request-listing']);
  }

  fetchListingData() {
    
    let payLoad;
    const passData = {
     pageIndex: 0,
     // pageElement: this.pageElements,
     pageElement: 3,

      sortByColumn: 'doiJpaLegalEntry.inwardNo',
      sortOrder: 'asc',
      jsonArr: [{
        'key':'activeStatus',
        'value': '1'
      }]
    
 }
    this.workflowService.getDataPost(passData,APIConst.DOI_JPA_LEGAL_ENTRY_FOR_REQUEST_LISTING)
    .subscribe((data:any) => {
     this.dataSource = new MatTableDataSource<any>(this.listingData(data.result.result));
    });
  }

  listingData(result:any[]) {
    let Element_Data: any = [];

   let count :number = 1;
   result.forEach(element => {
          
     let districtValue = this.districtList.filter(x => x.value == (''+element.districtId));
     let  districtValue1 = districtValue.length <= 0 ? '': districtValue[0].viewValue;
     const data = {
      srno: count++,
      district:districtValue1,
      courtCaseNo: element.courtCaseNo,
      courtCaseDate: this.dateFormatter(element.courtCaseDt, "dd/MM/yyyy"),
      courtDetail: element.courtDetails,
      claimId:  element.claimNumber,
      ploicyNo: element.policyNum,
      scheme: element.schemeName,

      applicantName: element.applicantName,
      detailofQuery: element.queryDetails,
      nameofDeceasedPerson: element.deadPersonName,
      dateOfAci: this.dateFormatter(element.accidentDeathDt,"dd/MM/yyyy"),
      courtDecision: element.courtDecision,
      createModeON: element.createdDate,
      modifyModeON: element.updatedDate,
      legalDtlsId :element.legalDtlsId,
      legalEntryId : element.legalEntryId,
      status: 'Request Not accepted',
      action: '',
    }
      
     Element_Data.push(data);
   });
   return Element_Data;
 }

 dateFormatter(date:string, pattern: string) {
  let  date1 = new Date(date);
  return this.datePipe.transform(date, pattern);
 }
 searchDisplay() {
  console.log(this.jpaLegalEntry);
  let map = new Map<string, string>();
  
  if(this.jpaLegalEntry.value.courtCaseDate !== '' && this.jpaLegalEntry.value.courtCaseDate !==undefined) {
   let date =  this.dateFormatter(this.jpaLegalEntry.value.courtCaseDate, "dd/MM/yyyy");
    map.set('courtCaseDt',date);
  }
  if(this.jpaLegalEntry.value.caseNo !== '' && this.jpaLegalEntry.value.caseNo !==undefined) {
    map.set('courtCaseNo',this.jpaLegalEntry.value.caseNo );
  }
  if(this.jpaLegalEntry.value.claimNo !== '' && this.jpaLegalEntry.value.claimNo !==undefined) {
    map.set('claimNumber',this.jpaLegalEntry.value.claimNo );
  }
 
  if(this.jpaLegalEntry.value.district !== '' && this.jpaLegalEntry.value.district !==undefined) {
   map.set('districtId', this.jpaLegalEntry.value.district );
  }
  if(this.jpaLegalEntry.value.ploicyNo !== '' && this.jpaLegalEntry.value.ploicyNo !==undefined) {
    map.set('policyNum',this.jpaLegalEntry.value.ploicyNo );
  }
  let arr: any =[];
  let i=0;
  map.forEach((key,value) => {
    arr[i++]= {'key':value, 'value': key };

  })
  const passData = {
    pageIndex: 0,
    // pageElement: this.pageElements,
    pageElement: 3,

     sortByColumn: 'courtCaseNo',
     sortOrder: 'asc',
     
     jsonArr: arr
   
}
  this.workflowService.getData(passData,APIConst.DOI_JPA_LEGAL_ENTRY_LISTING)
  .subscribe((data:any) => {
    console.log("Legal data " + data);
    this.dataSource = new MatTableDataSource<any>(this.listingData(data.result.result));
  })
}

 
editRecord(element) {
  this.jpaUtilityService.setSelectedJpaApprovedData(element);
  this.router.navigate(['./dashboard/doi/jpa-legal-entry']);
}

deleteRecord(element) {
  this.workflowService.deleteDocumentByPathParam(APIConst.DOI_JPA_LEGAL_DELETE_ENTRY_FOR_REQUEST +''+element.legalEntryId)
  .subscribe((data:any) => {
   this.dataSource = new MatTableDataSource<any>(this.listingData(data.result.result));
  });
}

}
