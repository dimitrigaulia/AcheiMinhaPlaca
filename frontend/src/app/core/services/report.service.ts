import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:5000/reports';

  constructor(private http: HttpClient, private authService: AuthService) {}

  createLost(data: any) {
    return this.http.post(`${this.apiUrl}/lost`, data, { headers: this.getHeaders() });
  }

  createFound(data: any, photo: File) {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (photo) formData.append('photo', photo);
    return this.http.post(`${this.apiUrl}/found`, formData, { headers: this.getHeaders(true) });
  }

  search(params: any) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key]) httpParams = httpParams.append(key, params[key]);
    });
    return this.http.get(`${this.apiUrl}/search`, { params: httpParams });
  }

  getMine() {
    return this.http.get(`${this.apiUrl}/mine`, { headers: this.getHeaders() });
  }

  getById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  private getHeaders(isMultipart = false) {
    const token = this.authService.getToken();
    let headers: any = { 'Authorization': `Bearer ${token}` };
    // Content-Type is handled automatically for JSON and Multipart
    return headers;
  }
}
