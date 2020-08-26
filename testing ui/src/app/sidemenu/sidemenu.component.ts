import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {

  pageType: any;
  currentUrl: any;
  public href: string = "";
  adminMenu: any = [];
  userMenu: any = [];
  managerMenu: any = [];
  settingsMenu: any = [];
  role: any = sessionStorage.getItem('role');
  constructor(
    public _route: ActivatedRoute,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.pageType = this._route.snapshot.url[0].path;
    console.log(this._route.snapshot);
    this.href = this.router.url;
    //alert(this.href);
    //alert(this.pageType);
    this.getAllModules();
  }

  getAllModules() {
    this.adminMenu = [
      { name: 'Dashboard', icon: 'fa-dashboard', url: '/admin/dashboard' },
      { name: 'Employee', icon: 'fa-folder-o', url: '/admin/employee' },
      { name: 'Customer', icon: 'fa-wpforms', url: '/admin/customer' },

      { name: 'Projects', icon: 'fa-dashboard', url: '/admin/project' },
      { name: 'Timesheet', icon: 'fa-wpforms', url: '/admin/timesheet' },
      { name: 'Reports', icon: 'fa-wpforms', url: '/admin/reports' }
    ];
    this.userMenu = [
      { name: 'Dashboard', icon: 'fa-dashboard', url: '/employee/dashboard' },
      { name: 'Timesheet', icon: 'fa-wpforms', url: '/employee/timesheet' }
    ];
    this.managerMenu = [
      { name: 'Dashboard', icon: 'fa-dashboard', url: '/customer/dashboard' }
    ];
    this.settingsMenu = [
      { name: 'Block Chain', icon: 'fa-cube', url: '/settings/blockchain' }
    ];
  }


  backTohome() {
    this.router.navigate(['/admin/dashboard']);
  }


}
