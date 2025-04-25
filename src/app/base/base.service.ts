import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
   private baseUrl = 'https://localhost:7090/api/';
   public iconUrl = 'https://localhost:7090/Attachments/';
  //private baseUrl = 'https://cranesopapitest.azurewebsites.net/api/';
  //public iconUrl = 'https://cranesopapitest.azurewebsites.net/Attachments/';

  constructor(private http: HttpClient) {}

  get(url: string) {
    return this.http.get(this.baseUrl + url);
  }

  getWithData(url: string, data?: any) {
    return this.http.get(this.baseUrl + url, { params: data });
  }

  post(url: string, data: any) {
    return this.http.post(this.baseUrl + url, data);
  }

  postwitoutdata(url: string, data?: any) {
    return this.http.post(this.baseUrl + url, data);
  }

  postWithDownload(url: string, data: any, res: any) {
    return this.http.post(this.baseUrl + url, data, res);
  }

  put(url: string, data: any) {
    return this.http.put(this.baseUrl + url, JSON.stringify(data));
  }

  delete(url: string, data: any) {
    return this.http.delete(this.baseUrl + url, { body: data });
  }

  postWithFile(url: string, formData: FormData) {
    const headers = new HttpHeaders(); // No need to set Content-Type for FormData
    return this.http.post(this.baseUrl + url, formData, { headers });
  }

  downloadFile(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.get(`${this.baseUrl}FileUpload/getFile?fileName=${fileName}`, {
      headers,
      responseType: 'blob',
    });
  }
}
