import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AdminsideServiceService } from 'src/app/service/adminside-service.service';
declare var window:any;

@Component({
  selector: 'app-missiontheme',
  templateUrl: './missiontheme.component.html',
  styleUrls: ['./missiontheme.component.css'],
})
export class MissionthemeComponent implements OnInit {
  missionThemeList: any[] = [];
  page: number = 1;
  itemsPerPages: number = 10;
  searchText: any;
  themeId: any;
  deleteThemeModal: any;

  constructor(
    private service: AdminsideServiceService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.getMissionThemeList();
    this.deleteThemeModal = new window.bootstrap.Modal(
      document.getElementById('removemissionThemeModal')
    );
  }

  getMissionThemeList() {
    this.service.MissionThemeList().subscribe(
      (data: any) => {
        if (data.result === 1) {
          this.missionThemeList = data.data;
        } else {
          this.toast.error({ summary: data.message, duration: 3000 });
        }
      },
      (err) => this.toast.error({ summary: err.message, duration: 3000 })
    );
  }

  editMissionTheme(id: number) {
    // Navigate to the edit page or handle editing logic
    this.router.navigate(['admin/updateMissionTheme', id]);
  }
// POST /api/MissionTheme/UpdateMissionTheme


  openRemoveMissionThemeModal(id: number) {
    this.themeId = id; // Store the ID for deletion
    this.deleteThemeModal.show(); // Show the modal
  }

  CloseRemoveMissionThemeModal() {
    this.deleteThemeModal.hide();
  }

  DeleteMissionTheme() {
    this.service.DeleteMissionTheme(this.themeId).subscribe(
      (data: any) => {
        if (data.result === 1) {
          this.toast.success({ detail: 'SUCCESS', summary: data.data, duration: 3000 });
          this.CloseRemoveMissionThemeModal();
          setTimeout(() => {
            this.router.navigate(['admin/missionTheme']);
          }, 1000);
        } else {
          this.toast.error({ summary: data.message, duration: 3000 });
        }
      },
      (err) => this.toast.error({ summary: err.message, duration: 3000 })
    );
  }
}
