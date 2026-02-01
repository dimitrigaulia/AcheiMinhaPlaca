import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiBaseUrl}/reports`;

  constructor(private http: HttpClient) {}

  createLost(data: any) {
    return this.http.post(`${this.apiUrl}/lost`, data);
  }

  createFound(data: any, photo: File) {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (photo) formData.append('photo', photo);
    return this.http.post(`${this.apiUrl}/found`, formData);
  }

  search(params: any) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key]) httpParams = httpParams.append(key, params[key]);
    });
    return this.http.get<any[]>(`${this.apiUrl}/search`, { params: httpParams });
  }

  getMine() {
    return this.http.get<any[]>(`${this.apiUrl}/mine`);
  }

  getById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  close(id: string) {
    return this.http.post(`${this.apiUrl}/${id}/close`, {});
  }

  remove(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
