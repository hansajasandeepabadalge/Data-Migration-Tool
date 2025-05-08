import {Component} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FileuploadService} from '../../services/fileupload.service';

interface UploadedFile {
  id: number;
  name: string;
  size: string;
  file: File
}

@Component({
  selector: 'app-main',
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent {
  uploadedFiles: UploadedFile[] = [];
  isDragging = false;


  constructor(private fileUploadService: FileuploadService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const sizeInKB = (file.size / 1024).toFixed(2);
          const fileInfo: UploadedFile = {
            id: Date.now(),
            name: file.name,
            size: `${sizeInKB} KB`,
            file: file
          };
          this.uploadedFiles.push(fileInfo);}
      });
    }
  }

  handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files);
      files.forEach(file => {
        const sizeInKB = (file.size / 1024).toFixed(2);
        const fileInfo: UploadedFile = {
          id: Date.now(),
          name: file.name,
          size: `${sizeInKB} KB`,
          file: file
        }
        this.uploadedFiles.push(fileInfo);
      })
    }
  }

  removeFile(id: number) {
    this.uploadedFiles = this.uploadedFiles.filter(file => file.id !== id);
  }

  removeAllFiles() {
    this.uploadedFiles = [];
  }


  toastMessage: { success?: string; error?: string; warn?: string } = {};
  isLoading: boolean = false;

  convertBtn(): void {
    if (!this.uploadedFiles || this.uploadedFiles.length === 0) {
      this.toastMessage.error = 'No files selected for upload.';
      return;
    }

    this.isLoading = true;
    const uploadTasks = this.uploadedFiles.map(file => ({
      file: file.file,
      name: file.name
    }));

    this.fileUploadService.postData(uploadTasks).subscribe({
      next: (response) => {
        this.toastMessage.success = response.message;
        this.uploadedFiles = []; // Clear files after successful upload
      },
      error: (error) => {
        this.toastMessage.error = error.message || 'An error occurred during upload';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
