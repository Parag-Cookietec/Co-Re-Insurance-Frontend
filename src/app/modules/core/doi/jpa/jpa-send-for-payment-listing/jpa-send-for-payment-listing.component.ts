import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ListValue, JPAPendingApprovalListing, JPAPendingSendForPayment, MasterEntry } from 'src/app/models/doi/doiModel';
import { DoiDirectives } from 'src/app/modules/core/common/directive/doi';
import { JpaClaimsEntryBase, JpaClaimsEntry } from './../../../../../models/doi/doiModel';
import { JpaUtilityService } from './../../service/jpa-utility.service';
import { DoiService } from './../../service/doi.service';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';

@Component({
  selector: 'app-jpa-send-for-payment-listing',
  templateUrl: './jpa-send-for-payment-listing.component.html',
  styleUrls: ['./jpa-send-for-payment-listing.component.css']
})
export class JpaSendForPaymentListingComponent implements OnInit {


  todayDate = new Date();
  // Form Group
  jpaClaimEntry: FormGroup;
  // Control
  districtCtrl: FormControl = new FormControl();
  schemeTypeCtrl: FormControl = new FormControl();
  typeOfYearCtrl: FormControl = new FormControl();
  typeMonthCtrl: FormControl = new FormControl();
  // List
  schemeType_list: ListValue[] = [];
  districtList: ListValue[] = [
    { value: '0', viewValue: 'Ahmedabad' },
    { value: '1', viewValue: 'Amreli' },
    { value: '2', viewValue: 'Anand' },
    { value: '3', viewValue: 'Aravalli' },
    { value: '4', viewValue: 'Banaskantha' },
    { value: '5', viewValue: 'Bharuch' },
    { value: '6', viewValue: 'Bhavnagar' },
  ];

  year_list: ListValue[] = [
    { value: '1', viewValue: '2009' },
    { value: '2', viewValue: '2010' },
    { value: '3', viewValue: '2011' },
    { value: '4', viewValue: '2012' },
    { value: '5', viewValue: '2013' },
    { value: '6', viewValue: '2014' },
    { value: '7', viewValue: '2015' },
    { value: '8', viewValue: '2016' },
    { value: '9', viewValue: '2017' },
    { value: '10', viewValue: '2018' },
    { value: '11', viewValue: '2019' },
    { value: '12', viewValue: '2020' },
  ];
  month_list: ListValue[] = [
    { value: '1', viewValue: 'Jan' },
    { value: '2', viewValue: 'Feb' },
    { value: '3', viewValue: 'Mar' },
    { value: '4', viewValue: 'Apr' },
    { value: '5', viewValue: 'May' },
    { value: '6', viewValue: 'Jun' },
    { value: '7', viewValue: 'Jul' },
    { value: '8', viewValue: 'Aug' },
    { value: '9', viewValue: 'Sep' },
    { value: '10', viewValue: 'Oct' },
    { value: '11', viewValue: 'Nov' },
    { value: '12', viewValue: 'Dec' },

  ];
  // Table Source

  ELEMENT_DATA: any[] = [];

  displayedColumns: string[] = [
    'select',
    'srno',
    'claimId',
    'policyNo',
    'scheme',
    'DecPersonName',
    'applicantName',
    'district',
    'taluka',
    'inwardNo',
    'createModeON',
    'modifyModeON',
    'status',
    'action'

  ];

  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder,
    private workFlowService: DoiService, private jpaUtilityService: JpaUtilityService) { }
  directiveObject = new DoiDirectives(this.router, this.dialog);

  ngOnInit() {
    this.jpaClaimEntry = this.fb.group({
      district: [''],
      month: [''],
      year: [''],
      fromDate: [''],
      endDate: [''],
      schemeType: ['']
    });

    this.getData(new JpaClaimsEntryBase());
    this.getMasterSchemeListing(new MasterEntry());
  }

  public onSearchClicked() {
    let payload = new JpaClaimsEntry();
    payload.districtId = this.jpaClaimEntry.controls.district.value;
    payload.schemeId = this.jpaClaimEntry.controls.schemeType.value;
    payload.month = this.jpaClaimEntry.controls.month.value;
    payload.year = this.jpaClaimEntry.controls.year.value;
    payload.fromDate = this.jpaClaimEntry.controls.fromDate.value;
    payload.toDate = this.jpaClaimEntry.controls.endDate.value;
    this.getData(payload);
  }

  public getData(payload: JpaClaimsEntryBase) {
    payload.claimStatus = APIConst.JPA_CLAIM_SEND_FOR_PAYMENT_APPLICATION;
    this.workFlowService.getData( payload, APIConst.JPA_CLAIM_ENTERY_LISTING_BY_STATUS).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.ELEMENT_DATA = resp.result;
          this.dataSource.data = this.ELEMENT_DATA;
        }
        
        this.clearForm();
      },
      err => {
        this.clearForm();
      }
    );
  }

  public getDistrict(id: number): string {
    if (id) {
      let data = this.districtList.filter(x => x.value == id.toString())[0];
      return data ? data.viewValue : '';
    }
  }

public getTaluka(id: number): string {
  return '';
}

  private clearForm() {
    this.jpaClaimEntry.reset();
  }

  private getMasterSchemeListing(payload: MasterEntry) {
    this.workFlowService.getDataPost(payload, APIConst.DOI_JPA_MASTER_SCHEME_LISTING).subscribe(
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

  // Navigation Route
  navigate(element: any) {
    this.jpaUtilityService.isEdit = true;
    this.jpaUtilityService.setSelectedJpaApprovedData(element);
    this.router.navigate(['./dashboard/doi/jpa/jpa-claim-entry-view']);
  }

  claimNoteLinkClicked(element: any) {
    this.jpaUtilityService.setSelectedJpaApprovedData(element);
    this.router.navigate(['./dashboard/doi/jpa/claim-note']);
  }

  memorandumLinkClicked(element: any) {
    this.jpaUtilityService.setSelectedJpaApprovedData(element);
    this.router.navigate(['./dashboard/doi/jpa/memorandum']);
  }


}
