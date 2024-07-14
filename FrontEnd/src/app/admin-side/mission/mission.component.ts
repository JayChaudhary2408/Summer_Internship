import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ToastrService } from 'ngx-toastr';
import { AdminsideServiceService } from 'src/app/service/adminside-service.service';
declare var window:any;

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css']
})
export class MissionComponent implements OnInit {
  deleteModal: any;
  missionList: any[] = [];
  page: number = 1;
  itemsPerPages = 10;
  searchText: any = '';
  missionId: any;

  constructor(public service: AdminsideServiceService, public toastr: ToastrService, public router: Router, private toast: NgToastService) { }

  ngOnInit(): void {
    this.FetchData();
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('removeMissionModal')
    );
  }

  FetchData() {
    this.service.MissionList().subscribe((data: any) => {
      if (data.result == 1) {
        this.missionList = data.data.map(x => {
          return {
            id: x.id,
            missionTitle: x.missionTitle,
            missionType: x.missionType,
            startDate: x.startDate,
            endDate: x.endDate,
            // Include other necessary properties
          };
        });
      } else {
        this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
      }
    });
  }

  OpenRemoveMissionModal(id: any) {
    this.deleteModal.show();
    this.missionId = id;
  }

  CloseRemoveMissionModal() {
    this.deleteModal.hide();
  }

  DeleteMissionData() {
    this.service.DeleteMission(this.missionId).subscribe((data: any) => {
      if (data.result == 1) {
        this.toast.success({ detail: "SUCCESS", summary: data.data, duration: 3000 });
        setTimeout(() => {
          this.deleteModal.hide();
          window.location.reload();
        }, 1000);
      } else {
        this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
      }
    }, err => this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 }));
  }

  EditMission(id: any) {
    this.router.navigate([`admin/editMission/${id}`]);
  }
}
