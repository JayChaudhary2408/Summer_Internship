import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminsideServiceService } from 'src/app/service/adminside-service.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-mission',
  templateUrl: './add-mission.component.html',
  styleUrls: ['./add-mission.component.css']
})
export class AddMissionComponent implements OnInit {
  addMissionForm: FormGroup;
  endDateDisabled: boolean = true;
  regDeadlineDisabled: boolean = true;
  formValid: boolean;
  countryList: any[] = [];
  cityList: any[] = [];
  missionThemeList: any[] = [];
  missionSkillList: any[] = [];
  formData = new FormData();
  imageListArray: any[] = [];

  constructor(
    public fb: FormBuilder,
    public service: AdminsideServiceService,
    public toastr: ToastrService,
    public router: Router,
    public datePipe: DatePipe,
    private toast: NgToastService
  ) { }

  ngOnInit(): void {
    this.addMissionFormValid();
    this.setStartDate();
    this.CountryList();
    this.GetMissionSkillList();
    this.GetMissionThemeList();
  }

  addMissionFormValid() {
    this.addMissionForm = this.fb.group({
      countryId: [null, Validators.compose([Validators.required])],
      cityId: [null, Validators.compose([Validators.required])],
      missionTitle: [null, Validators.compose([Validators.required])],
      missionDescription: [null, Validators.compose([Validators.required])],
      startDate: [null, Validators.compose([Validators.required])],
      endDate: [null, Validators.compose([Validators.required])],
      missionThemeId: [null, Validators.compose([Validators.required])],
      missionSkillId: [null, Validators.compose([Validators.required])],
      missionImages: [null, Validators.compose([Validators.required])],
      totalSheets: [null, Validators.compose([Validators.required])]
    });
  }

  get countryId() { return this.addMissionForm.get('countryId') as FormControl; }
  get cityId() { return this.addMissionForm.get('cityId') as FormControl; }
  get missionTitle() { return this.addMissionForm.get('missionTitle') as FormControl; }
  get missionDescription() { return this.addMissionForm.get('missionDescription') as FormControl; }
  get startDate() { return this.addMissionForm.get('startDate') as FormControl; }
  get endDate() { return this.addMissionForm.get('endDate') as FormControl; }
  get missionThemeId() { return this.addMissionForm.get('missionThemeId') as FormControl; }
  get missionSkillId() { return this.addMissionForm.get('missionSkillId') as FormControl; }
  get missionImages() { return this.addMissionForm.get('missionImages') as FormControl; }
  get totalSheets() { return this.addMissionForm.get('totalSheets') as FormControl; }

  setStartDate() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    this.addMissionForm.patchValue({
      startDate: todayString
    });
    this.endDateDisabled = false;
    this.regDeadlineDisabled = false;
  }

  CountryList() {
    console.log("Fetching country list...");
    this.service.CountryList().subscribe((data: any) => {
      console.log("Country list response:", data); // Log the full response
      if (data.status === "Success") {
        this.countryList = data.data;
        console.log("Country list data:", this.countryList); // Log the extracted data
      } else {
        this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
      }
    }, err => {
      console.error("Error fetching country list:", err); // Log error details
      this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 });
    });
  }
  

  CityList(event: any) {
    const countryId = event.target.value;
    console.log("Selected countryId:", countryId); // Debugging: Log the selected countryId
  
    this.service.CityList(countryId).subscribe((data: any) => {
      console.log("City list response:", data); // Debugging: Log the full response
      if (data.status === "Success") {
        this.cityList = data.data;
        console.log("City list data:", this.cityList); // Debugging: Log the extracted data
      } else {
        this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
      }
    }, err => {
      console.error("Error fetching city list:", err); // Debugging: Log error details
      this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 });
    });
  }
  

  GetMissionSkillList() {
    this.service.GetMissionSkillList().subscribe((data: any) => {
      if (data.result == 1) {
        this.missionSkillList = data.data;
      } else {
        this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
      }
    }, err => this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 }))
  }

  GetMissionThemeList() {
    this.service.GetMissionThemeList().subscribe((data: any) => {
      if (data.result == 1) {
        this.missionThemeList = data.data;
      } else {
        this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
      }
    }, err => this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 }))
  }

  OnSelectedImage(event: any) {
    const files = event.target.files;
    if (this.imageListArray.length > 5) {
      return this.toast.error({ detail: "ERROR", summary: "Maximum 6 images can be added.", duration: 3000 });
    }
    if (files) {
      this.formData = new FormData();
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageListArray.push(e.target.result);
        }
        reader.readAsDataURL(file)
      }
      for (let i = 0; i < files.length; i++) {
        this.formData.append('file', files[i]);
        this.formData.append('moduleName', 'Mission');
      }
      console.log(this.formData);
    }
  }

  async OnSubmit() {
    this.formValid = true;
    let imageUrl: any[] = [];
    let value = this.addMissionForm.value;
    
    // Convert missionSkillId to a comma-separated string if it's an array
    value.missionSkillId = Array.isArray(value.missionSkillId) ? value.missionSkillId.join(',') : value.missionSkillId;
  
    if (this.addMissionForm.valid) {
      // Upload images if any are selected
      if (this.imageListArray.length > 0) {
        await this.service.UploadImage(this.formData).pipe().toPromise().then((res: any) => {
          if (res.success) {
            imageUrl = res.data;
          }
        }, err => { this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 }) });
      }
      
      // Generate a comma-separated list of image URLs
      let imgUrlList = imageUrl.map(e => e.replace(/\s/g, "")).join(",");
      value.missionImages = imgUrlList;
  
      // Add default values to the mission data
      const missionData = {
        ...value,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        isDeleted: false,
        missionOrganisationName: "Default Organisation",
        missionOrganisationDetail: "Default Organisation Detail",
        missionType: "String",
        registrationDeadLine: new Date().toISOString(),
        missionDocuments: "Default Documents",
        missionAvilability: "Default Availability",
        missionVideoUrl: "Default Video URL",
        countryName: "India",
        cityName: "Default City",
        missionThemeName: "Default Theme",
        missionSkillName: "Default Skill",
        missionStatus: "Default Status",
        missionApplyStatus: "Default Apply Status",
        missionApproveStatus: "Default Approve Status",
        missionDateStatus: "Default Date Status",
        missionDeadLineStatus: "Default Deadline Status",
        missionFavouriteStatus: "Default Favourite Status",
        rating: 0
      };
  
      // Send the mission data to the backend
      this.service.AddMission(missionData).subscribe((data: any) => {
        if (data.result == 1) {
          this.toast.success({ detail: "SUCCESS", summary: data.data, duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['admin/mission']);
          }, 1000);
        } else {
          this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
        }
      });
      this.formValid = false;
    }
  }
  
  OnCancel() {
    this.router.navigateByUrl('admin/mission');
  }

  OnRemoveImages(item: any) {
    const index: number = this.imageListArray.indexOf(item);
    if (item !== -1) {
      this.imageListArray.splice(index, 1);
    }
  }
}
