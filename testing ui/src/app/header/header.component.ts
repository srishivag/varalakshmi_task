import { Component, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userData: any = [];
  public userid = sessionStorage.getItem('userid');
  public role = sessionStorage.getItem('role');
  public roles: any = [];
  public rolesArr: any = [];

  notificationsCount: any = 0;
  notifications: any = [];
  hiddenNotify: boolean = false;

  currentUrl: any;
  languages: any = [];
  public activeLanguage = 'en-Us';
  public href: string = "";
  public hideSwitch: any;
  username: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    $("#menu-toggle").click(function (e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");

    });
    // console.log("curret role is:", this.role);

    this.currentUrl = this.route.snapshot.url[0].path;
    this.role = sessionStorage.getItem('role');
    this.username = sessionStorage.getItem('username');
    console.log(this.role,'roleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',this.username)
    this.href = this.router.url;
    console.log(this.router.url);
    if (this.href.includes('/settings')) {
      this.hideSwitch = true;
    } else {
      this.hideSwitch = false;
    }
    this.rolesArr.push("admin", "employee", "customer");
  }

  logOut() {
    localStorage.clear();
    sessionStorage.clear();
    console.log(this.userid);
    this.authService.userLogout({ user_id: this.userid }).subscribe(res => {
      console.log('User is logged out');
      this.router.navigate(['/login']);
    })
  }


  changeRole(role: any) {
    console.log("get role is:", role);
    sessionStorage.setItem('role', role);
    this.router.navigate([`${role}/dashboard`]);
  }

}
