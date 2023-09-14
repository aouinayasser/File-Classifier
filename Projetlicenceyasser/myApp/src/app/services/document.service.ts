import { Injectable } from '@angular/core';
import { Document } from '../tabs/main/main.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DocumentService {
	apiUrl = 'http://localhost:8000/api';
	constructor(private http: HttpClient) { }
	getDocuments(): Observable<Document[]> {
		return this.http.get<Document[]>(`${this.apiUrl}/documents`);
		console.log('resultat:' + this.http.get(`${this.apiUrl}/documents`));
	}

	addDocument(document: Document): Observable<Document> {
		return this.http.post<Document>(`${this.apiUrl}/documents`, document);
	}

	UpdateDocument(documentId: number, document: Document): Observable<Document> {
		return this.http.put<Document>(`${this.apiUrl}/documents/${documentId}`,document);
	}

	deleteDocument(documentId: number): Observable<Document> {
		return this.http.delete<Document>(`${this.apiUrl}/documents/${documentId}`);
	}
}
