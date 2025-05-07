import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {
  private apiUrl: string = 'http://localhost:8080/api/files/uploadFiles';

  constructor(private http: HttpClient) {}

  postData(files: { file: File; name: string }[]): Observable<any> {
    const formData = new FormData();
    files.forEach((fileData) => {
      formData.append('files', fileData.file, fileData.name);
    });

    return this.http.post(this.apiUrl, formData);
  }
}
