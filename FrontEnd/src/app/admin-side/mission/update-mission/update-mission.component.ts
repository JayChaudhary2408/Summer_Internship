import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ToastrService } from 'ngx-toastr';
import { AdminsideServiceService } from 'src/app/service/adminside-service.service';

@Component({
  selector: 'app-update-mission',
  templateUrl: './update-mission.component.html',
  styleUrls: ['./update-mission.component.css']
})
export class UpdateMissionComponent implements OnInit {
  missionId: any;
  editData: any;
  editMissionForm: FormGroup;
  formValid: boolean;
  countryList: any[] = [];
  cityList: any[] = [];
  imageUrl: any[] = [];
  missionImage: any = '';
  isFileUpload = false;
  isDocUpload = false;
  missionDocName: any;
  missionDocText: any;
  formData = new FormData();
  formDoc = new FormData();
  missionThemeList: any[] = [];
  missionSkillList: any[] = [];
  typeFlag: boolean = false;
  imageListArray: any[] = [];

  constructor(
    public fb: FormBuilder,
    public service: AdminsideServiceService,
    public toastr: ToastrService,
    public router: Router,
    public activateRoute: ActivatedRoute,
    public datePipe: DatePipe,
    private toast: NgToastService
  ) {
    this.missionId = this.activateRoute.snapshot.paramMap.get("Id");
    this.editMissionForm = this.fb.group({
      id: [''],
      missionTitle: ['', Validators.compose([Validators.required])],
      missionDescription: ['', Validators.compose([Validators.required])],
      countryId: ['', Validators.compose([Validators.required])],
      cityId: ['', Validators.compose([Validators.required])],
      startDate: ['', Validators.compose([Validators.required])],
      endDate: ['', Validators.compose([Validators.required])],
      totalSheets: ['', Validators.compose([Validators.required])],
      missionThemeId: ['', Validators.compose([Validators.required])],
      missionSkillId: ['', Validators.compose([Validators.required])],
      missionImages: [''],
    });
    if (this.missionId != 0) {
      this.FetchDetail(this.missionId);
    }
  }

  ngOnInit(): void {
    this.CountryList();
    this.GetMissionSkillList();
    this.GetMissionThemeList();
    this.missionDocText = '';
  }

  CountryList() {
    this.service.CountryList().subscribe((data: any) => {
      if (data.status === "Success") {
        this.countryList = data.data;
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
    if (countryId) {
      this.service.CityList(countryId).subscribe((response: any) => {
        if (response.status === "Success") {
          this.cityList = response.data.map((city: any) => ({
            id: city.value,
            name: city.text
          }));
          console.log(this.cityList); // Log to ensure data is correctly mapped
        } else {
          this.toast.error({ detail: "ERROR", summary: response.message, duration: 3000 });
        }
      }, err => {
        console.error("Error fetching city list:", err); // Log error details
        this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 });
      });
    } else {
      this.cityList = [];
    }
  }

  HideOrShow(e: any) {
    if (e.target.value == "Time") {
      this.typeFlag = true;
    } else {
      this.typeFlag = false;
    }
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

  FetchDetail(id: any) {
    this.service.MissionDetailById(id).subscribe((data: any) => {
      this.editData = data.data;
      let startDateformat = this.datePipe.transform(this.editData.startDate, "yyyy-MM-dd");
      this.editData.startDate = startDateformat;
      let endDateformat = this.datePipe.transform(this.editData.endDate, "yyyy-MM-dd");
      this.editData.endDate = endDateformat;
      let registrationDeadLineDateformat = this.datePipe.transform(this.editData.registrationDeadLine, "yyyy-MM-dd");
      this.editData.registrationDeadLine = registrationDeadLineDateformat;
      this.editMissionForm = this.fb.group({
        id: [this.editData.id],
        missionTitle: [this.editData.missionTitle, Validators.compose([Validators.required])],
        missionDescription: [this.editData.missionDescription, Validators.compose([Validators.required])],
        countryId: [this.editData.countryId, Validators.compose([Validators.required])],
        cityId: [this.editData.cityId, Validators.compose([Validators.required])],
        startDate: [this.editData.startDate, Validators.compose([Validators.required])],
        endDate: [this.editData.endDate, Validators.compose([Validators.required])],
        totalSheets: [this.editData.totalSheets, Validators.compose([Validators.required])],
        missionThemeId: [this.editData.missionThemeId, Validators.compose([Validators.required])],
        missionSkillId: [this.editData.missionSkillId.split(','), Validators.compose([Validators.required])],
        missionImages: [''],
      });
      this.service.CityList(this.editData.countryId).subscribe((data: any) => {
        this.cityList = data.data;
      });
      if (this.editData.missionImages) {
        let imageList = this.editData.missionImages;
        this.imageUrl = imageList.split(',');
        for (const photo of this.imageUrl) {
          this.imageListArray.push(this.service.imageUrl + '/' + photo.replaceAll('\\', '/'));
        }
      }
    });
  }

  get countryId() { return this.editMissionForm.get('countryId') as FormControl; }
  get cityId() { return this.editMissionForm.get('cityId') as FormControl; }
  get missionTitle() { return this.editMissionForm.get('missionTitle') as FormControl; }
  get missionDescription() { return this.editMissionForm.get('missionDescription') as FormControl; }
  get startDate() { return this.editMissionForm.get('startDate') as FormControl; }
  get endDate() { return this.editMissionForm.get('endDate') as FormControl; }
  get missionThemeId() { return this.editMissionForm.get('missionThemeId') as FormControl; }
  get missionSkillId() { return this.editMissionForm.get('missionSkillId') as FormControl; }
  get missionImages() { return this.editMissionForm.get('missionImages') as FormControl; }
  get totalSheets() { return this.editMissionForm.get('totalSheets') as FormControl; }

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
      this.isFileUpload = true;
    }
  }

  async OnSubmit() {
    this.formValid = true;
    let value = this.editMissionForm.value;
  
    // Convert missionSkillId to a comma-separated string if it's an array
    value.missionSkillId = Array.isArray(value.missionSkillId) ? value.missionSkillId.join(',') : value.missionSkillId;
  
    if (this.editMissionForm.valid) {
      let updateImageUrl = '';
      // Upload images if any are selected
      if (this.isFileUpload) {
        await this.service.UploadImage(this.formData).pipe().toPromise().then((res: any) => {
          if (res.success) {
            updateImageUrl = res.data;
          }
        }, err => this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 }));
      }
      function formatDateWithTimezone(date: Date): string {
        const offset = date.getTimezoneOffset();
        const sign = offset > 0 ? '-' : '+';
        const absOffset = Math.abs(offset);
        const hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
        const minutes = String(absOffset % 60).padStart(2, '0');
        
        return `${date.toISOString().slice(0, 19)}${sign}${hours}:${minutes}`;
    }
    
      // Add default values to the mission data
      const missionData = {
        ...this.editData, // Existing mission data
        ...value, // Updated form values
        missionOrganisationName: this.editData.missionOrganisationName || "Default Organisation",
        missionOrganisationDetail: this.editData.missionOrganisationDetail || "Default Organisation Detail",
        missionType: this.editData.missionType || "Default Type",
        registrationDeadLine: this.editData.registrationDeadLine ? new Date(this.editData.registrationDeadLine).toISOString() : new Date().toISOString(),
        missionDocuments: this.editData.missionDocuments || "Default Documents",
        missionAvilability: this.editData.missionAvilability || "Default Availability",
        missionVideoUrl: this.editData.missionVideoUrl || "Default Video URL",
        countryName: this.editData.countryName || "Default Country",
        cityName: this.editData.cityName || "Default City",
        missionThemeName: this.editData.missionThemeName || "Default Theme",
        missionSkillName: this.editData.missionSkillName || "Default Skill",
        missionStatus: this.editData.missionStatus || "Default Status",
        missionApplyStatus: this.editData.missionApplyStatus || "Default Apply Status",
        missionApproveStatus: this.editData.missionApproveStatus || "Default Approve Status",
        missionDateStatus: this.editData.missionDateStatus || "Default Date Status",
        missionDeadLineStatus: this.editData.missionDeadLineStatus || "Default Deadline Status",
        missionFavouriteStatus: this.editData.missionFavouriteStatus || "Default Favourite Status",
        rating: this.editData.rating || 0
      };
  
      if (this.isFileUpload) {
        missionData.missionImages = updateImageUrl;
      }
  
      // Convert date fields to UTC
      missionData.modifiedDate = new Date(missionData.modifiedDate).toISOString();
      if (missionData.registrationDeadLine) {
        missionData.registrationDeadLine = new Date(missionData.registrationDeadLine).toISOString();
      }
  
      // Send the mission data to the backend
      this.service.UpdateMission(missionData).subscribe((data: any) => {
        if (data.result == 1) {
          this.toast.success({ detail: "SUCCESS", summary: data.message, duration: 3000 });
          this.router.navigate(['/admin/mission']);
        } else {
          this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
        }
      }, err => {
        this.toast.error({ detail: "ERROR", summary: err.error.message });
      });
  
      this.formValid = false;
    }
  }
  

  RemoveImage(index: any) {
    this.imageListArray.splice(index, 1);
  }

  RemovePhoto(url: any, index: any) {
    let imageArray = this.imageUrl.filter(x => x !== url);
    this.editData.missionImages = imageArray.join(',');
    this.service.UpdateMission(this.editData).subscribe((data: any) => {
      if (data.result == 1) {
        this.imageListArray.splice(index, 1);
      } else {
        this.toast.error({ detail: "ERROR", summary: data.message });
      }
    }, err => {
      this.toast.error({ detail: "ERROR", summary: err.message });
    })
  }

  OnSelectedDoc(event: any) {
    const files = event.target.files;
    if (files) {
      this.formDoc = new FormData();
      for (let i = 0; i < files.length; i++) {
        this.formDoc.append('file', files[i]);
        this.formDoc.append('moduleName', 'Mission');
        this.missionDocName = files[i].name;
      }
      this.isDocUpload = true;
    }
  }

  async UploadDoc() {
    await this.service.UploadImage(this.formDoc).pipe().toPromise().then((res: any) => {
      if (res.success) {
        this.editData.missionDocuments = res.data;
        this.service.UpdateMission(this.editData).subscribe((data: any) => {
          if (data.result == 1) {
            this.toast.success({ detail: "SUCCESS", summary: data.message, duration: 3000 });
            this.router.navigate(['/admin/mission/list']);
          } else {
            this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
          }
        }, err => {
          this.toast.error({ detail: "ERROR", summary: err.error.message });
        });
      }
    }, err => this.toast.error({ detail: "ERROR", summary: err.error.message }));
  }

  OnCancel() {
    this.router.navigate(['/admin/mission/list']);
  }
}
