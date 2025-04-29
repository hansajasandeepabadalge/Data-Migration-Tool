import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import * as XLSX from 'xlsx';

interface UploadedFile {
  id: number;
  name: string;
  size: string;
  file: File;
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


  convertExcelToCSV() {
    this.uploadedFiles.forEach((file, index) => {
      const count = index + 1;
      const reader = new FileReader();

      reader.onerror = () => {
        console.error(`Error reading file: ${file.name}`);
      };

      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          if (!event.target?.result) {
            throw new Error('Failed to read file');
          }

          const data = event.target.result as string;
          const workbook = XLSX.read(data, { type: 'binary' });

          if (!workbook.SheetNames.length) {
            throw new Error('No sheets found in the workbook');
          }

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          if (!worksheet) {
            throw new Error('Worksheet is empty');
          }

          const csvData = XLSX.utils.sheet_to_csv(worksheet, {
            FS: '|',
            RS: '\n',
          });

          const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
          const downloadLink = document.createElement('a');
          const url = URL.createObjectURL(blob);

          try {
            const fileName = `2_${count}_${file.name.replace(/\.[^/.]+$/, '')}.csv`;
            downloadLink.href = url;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
          } finally {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
          }
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
        }
      };
      reader.readAsBinaryString(file.file);
    });
  }
}
