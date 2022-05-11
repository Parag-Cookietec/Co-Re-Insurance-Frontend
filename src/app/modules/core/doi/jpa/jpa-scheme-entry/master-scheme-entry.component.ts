import { DoiService } from '../../service/doi.service';
import { JpaUtilityService } from '../../service/jpa-utility.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { jpaMessage } from 'src/app/common/error-message/common-message.constants';
import { MasterEntry } from 'src/app/models/doi/doiModel';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { runInThisContext } from 'vm';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';

declare function SetEnglish();
declare function SetGujarati();


@Component({
  selector: 'app-master-scheme-entry',
  templateUrl: './master-scheme-entry.component.html',
  styleUrls: ['./master-scheme-entry.component.css']
})
export class MasterSchemeEntryComponent implements OnInit {
  currentLang = new BehaviorSubject<string>('Eng');
  isLangChange = false;
  hasFocusSet: number;
  selectedIndex: number;
  isEdit = false;
  editschemeId: number;
  // From Group
  masterClaimEntry: FormGroup;
  StatusCtrl: FormControl = new FormControl();
  // Date
  todayDate = Date.now();
  // Variable
  errorMessage = jpaMessage;
  // List of Status
  StatusList: any[] = [];

  // Table COntent Date
  Element_Data: MasterEntry[] = [];
  cacheSchemeList: MasterEntry[] = [];
  addButtonNameListing: string = 'Add';
  addButtonNameMaster: string = 'Add';
  // selectedActiveStatus: number = 1;
  selected = "0";

  // Table Source
  dataSource = new MatTableDataSource<any>(this.Element_Data);
  columns: string[] = ['position', 'schemeName', 'schemeNameGuj', 'schemeShortname',
    'nodalOffice', 'claimAmt', 'createdDate', 'updatedDate', 'status'];
  columnstwo: string[] = ['position', 'schemeName', 'schemeNameGuj', 'schemeShortname',
    'nodalOffice', 'claimAmt', 'status', 'action'];
  referenceNumber: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public fb: FormBuilder, private el: ElementRef,
    private jpaUtilityService: JpaUtilityService, private workflowService: DoiService, public dialog: MatDialog) { }

  ngOnInit() {
    this.referenceNumber = this.jpaUtilityService.getNewPolicyNumber();
    this.getMasterSchemeListing(new MasterEntry());
    this.getActiveInActiveList();
    this.masterClaimEntry = this.fb.group({
      schemeNameList: [''],
      schemeShortnameList: [''],
      nodalOfficeList: [''],
      schemeName: [''],
      schemeNameGuj: [''],
      schemeShortname: [''],
      nodalOffice: [''],
      claimAmt: [''],
      remarks: [''],
      status: 0,
      maximumAgeRange: [''],
      minimumAgeRange: [''],
    });
    this.dataSource.paginator = this.paginator;
  }
  // reset data in form
  clearForm() {
    this.masterClaimEntry.reset();
    this.referenceNumber = this.jpaUtilityService.getNewPolicyNumber();
    Object.keys(this.masterClaimEntry.controls).forEach(key => {
      this.masterClaimEntry.get(key).setErrors(null);
    });
    this.masterClaimEntry.get("status").setValue(0);
  }

  validateForm() {
    Object.keys(this.masterClaimEntry.controls).forEach((field) => {
      const control = this.masterClaimEntry.get(field);
      control.markAsTouched({ onlySelf: true });
      if ((field === 'schemeName' || field === 'schemeNameGuj' || field === 'schemeShortname' || field === 'nodalOffice' || field === 'maximumAgeRange' || field === 'minimumAgeRange' || field === 'claimAmt' || field === 'Status') && this.masterClaimEntry.status === 'VALID' && (control.value === null || control.value === '' || control.value === ' ')) {
        control.setErrors(Validators.required);
      }
    });
  }
  // on click add record in table Source
  addRecord() {
    this.validateForm();
    if (this.masterClaimEntry.valid) {
      let payload: MasterEntry = new MasterEntry();
      payload.schemeName = this.masterClaimEntry.controls.schemeName.value;
      payload.schemeShortname = this.masterClaimEntry.controls.schemeShortname.value;
      payload.nodalOffice = this.masterClaimEntry.controls.nodalOffice.value;
      payload.schemeNameGuj = this.masterClaimEntry.controls.schemeNameGuj.value;
      payload.maximumAgeRange = +this.masterClaimEntry.controls.maximumAgeRange.value;
      payload.minimumAgeRange = +this.masterClaimEntry.controls.minimumAgeRange.value;
      payload.claimAmount = +this.masterClaimEntry.controls.claimAmt.value;
      payload.remarks = this.masterClaimEntry.controls.remarks.value;
      payload.status = this.masterClaimEntry.controls.status.value;
      if (this.isEdit) {
        payload.schemeId = this.editschemeId;
      }
      this.cacheSchemeList.push(payload);
      if(payload.schemeId){
        this.Element_Data = this.Element_Data.filter(x => x.schemeId != payload.schemeId);
      }
      this.Element_Data.push(payload);
      this.dataSource.data = this.Element_Data;
      this.clearForm();
    }
  }

  saveRecord() {
    if (this.cacheSchemeList.length > 0) {
      this.putMasterSchemeEntry(this.cacheSchemeList);
    }
    this.cacheSchemeList = [];
    this.clearForm();
  }

  masterClaimEntryData() { }
  // get tab index
  getTabIndex(tabIndex) {
    this.selectedIndex = tabIndex;
  }

  goToNext() {
    this.selectedIndex = 1;
    Object.keys(this.masterClaimEntry.controls).forEach(key => {
      this.masterClaimEntry.get(key).setErrors(null);
    });
  }
  gePrevIndex() {
    this.selectedIndex = 0;
  }

  // Eng Guj functions starts
  setEnglishOnFocusOut(event: any, src: string) {
    if (event) {
      switch (src) {
        case 'srtNameGuj':
          this.masterClaimEntry.patchValue({
            schemeNameGuj: event.srcElement.value
          });
          break;
        case 'remarks':
          this.masterClaimEntry.patchValue({
            remarks: event.srcElement.value
          });
          break;
      }
    }
    SetEnglish();
  }
  setGujaratiDefaultFocus() {
    SetGujarati();
  }
  setGujaratiDefault() {
    if (!this.isLangChange) {
      SetGujarati();
      this.currentLang.next('Eng');
    }
  }
  toggleLanguage() {
    this.isLangChange = true;
    const elements = this.el.nativeElement.querySelectorAll('.hasfocus')[0];
    if (elements != undefined) {
      if (this.currentLang.value == 'Guj') {
        SetEnglish();
        this.currentLang.next('Eng');
      } else {
        SetGujarati();
        this.currentLang.next('Guj');
      }
      elements.focus();
    }
  }

  private getMasterSchemeListing(payload: MasterEntry) {
    this.workflowService.getDataPost(payload, APIConst.DOI_JPA_MASTER_SCHEME_LISTING).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.Element_Data = resp.result;
          this.dataSource.data = this.Element_Data;
        }
      });
  }

  private putMasterSchemeEntry(payload: MasterEntry[]) {
    this.workflowService.saveDocumentsData(APIConst.DOI_JPA_MASTER_SCHEME_ENTRY, payload).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.Element_Data = resp.result;
          this.dataSource.data = this.Element_Data;
        }
        this.addButtonNameMaster = "Add";
        this.addButtonNameListing = "Add";
        this.isEdit = false;
        this.referenceNumber = this.jpaUtilityService.getNewPolicyNumber();
        this.editschemeId = -999;
        this.clearForm();
      },
      err => {
        this.addButtonNameMaster = "Add";
        this.addButtonNameListing = "Add";
        this.referenceNumber = this.jpaUtilityService.getNewPolicyNumber();
        this.isEdit = false;
        this.editschemeId = -999;
        this.clearForm();
      }
    );
  }

  public onDeleteClickScheme(element: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: msgConst.CONFIRMATION_DIALOG.DELETE
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        if (element.schemeId == null) {
          var index = this.cacheSchemeList.indexOf(element);
          if (index !== -1) {
            this.cacheSchemeList.splice(index, 1);
          }
          var index1 = this.Element_Data.indexOf(element);
          if (index1 !== -1) {
            this.Element_Data.splice(index, 1);
          }
          this.dataSource.data = this.Element_Data;
        } else {
          this.workflowService.deleteDocument(APIConst.DOI_JPA_MASTER_SCHEME_DELETE, element.schemeId)
            .subscribe(resp => {
              this.filterData(element);
            })
        }
      }
    });
  }
  public onEditClickScheme(element: MasterEntry) {
    if (element) {
      this.masterClaimEntry.patchValue({
        schemeName: element.schemeName,
        status: element.status,// === true ? '1' : '2',
        nodalOffice: element.nodalOffice,
        schemeShortname: element.schemeShortname,
        schemeNameGuj: element.schemeNameGuj,
        maximumAgeRange: element.maximumAgeRange,
        minimumAgeRange: element.minimumAgeRange,
        claimAmt: element.claimAmount,
        remarks: element.remarks
      });
      this.isEdit = true;
      this.referenceNumber = element.referenceNo
      this.editschemeId = element.schemeId;
    }
  }

  public onSearchCicked() {
    let payload: MasterEntry = new MasterEntry();
    payload.schemeName = this.masterClaimEntry.controls.schemeNameList.value;
    payload.schemeShortname = this.masterClaimEntry.controls.schemeShortnameList.value;
    payload.nodalOffice = this.masterClaimEntry.controls.nodalOfficeList.value;
    payload.status = this.masterClaimEntry.controls.status.value;
    this.getMasterSchemeListing(payload);
    this.referenceNumber = this.jpaUtilityService.getNewPolicyNumber();
  }

  public onToggleChange(value, element) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: msgConst.CONFIRMATION_DIALOG.UPDATE_STATUS
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        let payload: MasterEntry = new MasterEntry();
        this.Element_Data.forEach((x: any) => {
          if (x.schemeId == element.schemeId) {
            x.status = value.checked == true ? 1 : 2;
          }
        });

        payload.schemeId = element.schemeId;
        payload.status = element.status;
        this.workflowService.saveDocumentsData(APIConst.DOI_JPA_MASTER_SCHEME_UPDATE, payload)
          .subscribe(resp => {

          })
      }
    });
  }

  public getActiveStatus(status) {
    return status == 1 ? true : false;
  }

  private filterData(element: MasterEntry) {
    this.Element_Data = this.Element_Data.filter(x => x.schemeId !== element.schemeId);
    this.dataSource.data = this.Element_Data;
  }

  getActiveInActiveList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_ACTIVE_INACTIVE_LIST_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.StatusList = resp.result;
        }
      }
    );
  }
}
