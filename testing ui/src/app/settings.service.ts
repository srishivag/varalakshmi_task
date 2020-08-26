import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }

  /**customer services*/
  addCustomerService(data: any) {
    return this.http.post(ApiService.API.ADD_NEW_CUSTOMER, data);
  }
  getAllCustomerService() {
    return this.http.get(ApiService.API.GET_CUSTOMERS_LIST);
  }

  updateCustomerInfo(data: any) {
    return this.http.post(ApiService.API.UPDATE_CUSTOMER_INFO, data);
  }

  /**project service */
  addProjectService(data: any) {
    return this.http.post(ApiService.API.ADD_NEW_PROJECT, data);
  }
  getAllProjectsService() {
    return this.http.get(ApiService.API.GET_PROJECT_LIST);
  }


  /**employee services*/
  getAllUsers(data?:any) {
    return this.http.post(ApiService.API.GET_USERS_LIST,data);
  }

  //add employee
  postemployee(data: any) {
    return this.http.post(ApiService.API.ADD_NEW_EMPLOYEE, data);
  }


  /**tasks */

  getAllTaskService() {
    return this.http.get(ApiService.API.GET_TASKS_LIST);
  }

  /**timesheet */
  addTimesheetService(data: any) {
    return this.http.post(ApiService.API.ADD_NEW_TIMESHEET, data);

  }

  getAllTimesheetsService(data){
    return this.http.post(ApiService.API.GET_TIMESHEETS,data);

  }

  /**reports */
  
  getGeneratedReports(data:any) {
    return this.http.post(ApiService.API.GET_REPORTS_LIST,data);
  }

}
