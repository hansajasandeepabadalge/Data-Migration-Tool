import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

interface UploadedFile {
  id: number;
  name: string;
  size: string;
}



@Component({
  selector: 'app-main',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent {

  uploadedFiles: UploadedFile[] = [];

  handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files);

      files.forEach(file => {
        const sizeInKB = (file.size / 1024).toFixed(2);

        const fileInfo: UploadedFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: `${sizeInKB} KB`
        }

        this.uploadedFiles.push(fileInfo);
      })

      console.log(this.uploadedFiles);
    }
  }

  removeFile(id: number) {
    this.uploadedFiles = this.uploadedFiles.filter(file => file.id !== id);
    console.log(this.uploadedFiles);
  }

  removeAllFiles() {
    this.uploadedFiles = [];
  }

  openFile() {
    
  }

}
