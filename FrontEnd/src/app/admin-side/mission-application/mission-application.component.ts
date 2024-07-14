import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AdminsideServiceService } from 'src/app/service/adminside-service.service';

@Component({
  selector: 'app-mission-application',
  templateUrl: './mission-application.component.html',
  styleUrls: ['./mission-application.component.css']
})
export class MissionApplicationComponent implements OnInit {
  applicationList:any[]=[];
  searchText:any="";
  page: number = 1;
  itemsPerPages: number = 5;
  applicationId:any;
  constructor(public service:AdminsideServiceService,private toast:NgToastService,private route:Router) { }

  ngOnInit(): void {
    this.FetchMissionApplicationList();
  }

  getStatus(status) {
    return status ? 'Approve' : 'Pending';
  }

  FetchMissionApplicationList(){
    this.service.MissionApplicationList().subscribe((data:any)=>{
      if(data.result == 1)
      {
          this.applicationList = data.data;
      }
      else
      {
        this.toast.error({detail:"ERROR",summary:data.message,duration:3000});
      }
    },err=>this.toast.error({detail:"ERROR",summary:err.message,duration:3000}));
  }

  ApproveMissionApplication(value: any) {
    // Set a default UserImage value if it's missing
    const requestPayload = {
      ...value,
      userImage: value.userImage || "default_image_url_or_base64" // Set your default value here
    };
  
    this.service.MissionApplicationApprove(requestPayload).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.toast.success({ detail: "SUCCESS", summary: data.data, duration: 3000 });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
        }
      },
      (err) => {
        this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 });
      }
    );
  }
  
  DeleteMissionApplication(value: any) {
    // Assuming UserImage might be needed here as well
    const requestPayload = {
      ...value,
      userImage: value.userImage || "default_image_url_or_base64" // Set your default value here
    };
  
    this.service.MissionApplicationDelete(requestPayload).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.toast.success({ detail: "SUCCESS", summary: data.data, duration: 3000 });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
        }
      },
      (err) => {
        this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 });
      }
    );
  }
  
  
}
