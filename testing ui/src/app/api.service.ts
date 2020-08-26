import { environment } from '../environments/environment';

export class ApiService {
  public static timer = 30000;
  public static API = {
    GET_API_WORK: environment.apiUrl + '/server',

    // LOGIN and SIGNUP API URL's
    LOGIN: environment.apiUrl + '/login',

    VALID_LOGIN: environment.apiUrl + '/validlogin',

    VALIDATE_USER: environment.apiUrl + '/validateuser',

    USER_LOGOUT: environment.apiUrl + '/logout',

    // USERS API URLS's
    GET_USERS_LIST: environment.apiUrl + '/getUsers',


    UPDATE_USER_STATUS: environment.apiUrl + '/updateuserstatus',


    ADD_NEW_EMPLOYEE: environment.apiUrl + '/addnewemployee',

    // TASKS API URL's
    GET_ALL_TASKS: environment.apiUrl + '/getTasks',

    /**REPORTS */
    GET_REPORTS_LIST: environment.apiUrl + '/getreports',

    /**customer */
    ADD_NEW_CUSTOMER: environment.apiUrl + '/add_new_customer',

    GET_CUSTOMERS_LIST: environment.apiUrl + '/get_customers',

    UPDATE_CUSTOMER_INFO: environment.apiUrl + '/update_customer',

    DELETE_CUSTOMER: environment.apiUrl + '/delete_customer',

    /**Project */
    ADD_NEW_PROJECT: environment.apiUrl + '/add_project',
    
    GET_PROJECT_LIST: environment.apiUrl + '/get_all_project',

    /**TASKS */
    GET_TASKS_LIST: environment.apiUrl + '/get_all_tasks',

    /**TIME SHEETS */
    ADD_NEW_TIMESHEET: environment.apiUrl + '/add_new_timesheet',
    GET_TIMESHEETS: environment.apiUrl + '/get_all_timesheets',

  }
}