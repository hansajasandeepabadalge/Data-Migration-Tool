import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  private apiurl = 'http://localhost:8080/api/files/uploadFiles';

  constructor(private http: HttpClient) {}

  postData(fileData: { file: File, name: string }) {
    const formData = new FormData();
    formData.append('file', fileData.file, fileData.name);

    return this.http.post(this.apiurl, formData);
  }
}
