import { Injectable } from '@angular/core';

/*
  Generated class for the BlueApiServiceProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BlueApiServiceProvider {

  baseURL = "http://web-bluecompute.apps.mfstorefront.os.fyre.ibm.com/";
  clientId = "bluecomputeweb"
  clientSecret = "bluecomputewebs3cret"

  public userState = {
    accessToken : null,
    authenticated: false
  };

  constructor() {
  }

  logout() {
    this.userState.accessToken = null;
    this.userState.authenticated = false;
  }
  getCatalog(successCallback, errorCallback) {
    var restUrl = this.baseURL + 'catalog/';
    var requestType = 'GET';
    this.invokeService(restUrl, requestType, null, successCallback, errorCallback);
  }
  
  getItemById(itemId, successCallback, errorCallback) {
    var restUrl = this.baseURL + 'catalog/' + itemId;
    var requestType = 'GET';
    this.invokeService(restUrl, requestType, null, successCallback, errorCallback);
  }

  getItemReviewById(itemId, successCallback, errorCallback) {
    var restUrl = this.baseURL + 'review/' + itemId;
    var requestType = 'GET';
    this.invokeService(restUrl, requestType, null, successCallback, errorCallback);
  }

  loginUser(parameters, successCallback, errorCallback) {
    var restUrl = this.baseURL + 'oauth/token'
    var requestType = 'POST';
    this.invokeService(restUrl, requestType, parameters, successCallback, errorCallback);
  }

  buyItems(parameters, successCallback, errorCallback) {
    var access_token = this.userState.accessToken;
    var restUrl = this.baseURL + 'order/';
    var requestType = 'POST_AUTH';
    this.invokeService(restUrl, requestType, parameters, successCallback, errorCallback, access_token);
  }

  addReviewItem(access_token, itemId, parameters, successCallback, errorCallback) {
    var restUrl = this.baseURL + 'review/' + itemId;
    var requestType = 'POST_AUTH';
    this.invokeService(restUrl, requestType, parameters, successCallback, errorCallback, access_token);
  }

  getCustomerProfile(successCallback, errorCallback) {
    var access_token = this.userState.accessToken;
    var restUrl = this.baseURL + 'customer/';
    var requestType = 'GET_AUTH';
    this.invokeService(restUrl, requestType, null, successCallback, errorCallback, access_token);
  }

  getCustomerOrders(successCallback, errorCallback) {
    var access_token = this.userState.accessToken;
    var restUrl = this.baseURL + 'order/';
    var requestType = 'GET_AUTH';
    this.invokeService(restUrl, requestType, null, successCallback, errorCallback, access_token);
  }


  private invokeService(restUrl, requestType, parameters, successCallback, errorCallback, access_token?) {
    var resourceRequest: WLResourceRequest;
    if (requestType == 'GET') {
      resourceRequest = new WLResourceRequest(restUrl, WLResourceRequest.GET);
      resourceRequest.send().then(successCallback, errorCallback);
    }
    else if (requestType == 'GET_AUTH') {
      resourceRequest = new WLResourceRequest(restUrl, WLResourceRequest.GET);
      resourceRequest.addHeader("Authorization", 'Bearer ' + access_token);
      resourceRequest.send().then(successCallback, errorCallback);
    }
    else if (requestType == 'DELETE') {
      resourceRequest = new WLResourceRequest(restUrl, WLResourceRequest.DELETE);
      resourceRequest.send().then(successCallback, errorCallback);
    } else if (requestType == 'POST_AUTH') {
      resourceRequest = new WLResourceRequest(restUrl, WLResourceRequest.POST);
      resourceRequest.addHeader("Authorization", 'Bearer ' + access_token);
      resourceRequest.addHeader("Content-Type", 'application/x-www-form-urlencoded')
      resourceRequest.sendFormParameters(parameters).then(successCallback, errorCallback);
    } else {
      var basicAuthToken = this.clientId + ":" + this.clientSecret;
      var authToken = 'Basic ' + btoa(basicAuthToken);
      resourceRequest = new WLResourceRequest(restUrl, WLResourceRequest.POST);
      resourceRequest.addHeader("Authorization", authToken);
      resourceRequest.addHeader("Content-Type", 'application/x-www-form-urlencoded')
      resourceRequest.sendFormParameters(parameters).then(successCallback, errorCallback);
    }
  }



}
