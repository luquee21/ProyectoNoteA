import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HTTP) {
  }


  public getAllNotes(id: number, page:number): Promise<HTTPResponse> {
    let url = 'https://luque21.duckdns.org:4085/notes/all/' + id + '/page/' +page;
    return this.http.get(url, {}, { 'apikey': '3i213Kl12s*@' });
  }

  public getAllNotesShared(id: number, page:number): Promise<HTTPResponse> {
    let url = 'https://luque21.duckdns.org:4085/notes/shared/all/' + id + '/page/' +page;
    return this.http.get(url, {}, { 'apikey': '3i213Kl12s*@' });
  }

  public getSharedUsers(id: number): Promise<HTTPResponse> {
    let url = 'https://luque21.duckdns.org:4085/notes/shared/users/' + id;
    return this.http.get(url, {}, { 'apikey': '3i213Kl12s*@' });
  }

  public createNote(title: string, id: number): Promise<HTTPResponse> {
    let url = 'https://luque21.duckdns.org:4085/notes/' + id;
    return this.http.post(url, { 'title': title }, { 'apikey': '3i213Kl12s*@' });
  }

  public updateNoteContent(content: string, id: number, id_user: number, latitud, longitud): Promise<HTTPResponse> {
    let url = 'https://luque21.duckdns.org:4085/notes/' + id;
    if(latitud != 0 && longitud != 0){
      return this.http.put(url, { 'content': content, 'id_user': id_user, 'latitude': latitud, 'longitude': longitud }, { 'apikey': '3i213Kl12s*@' });
    }
    return this.http.put(url, { 'content': content, 'id_user': id_user }, { 'apikey': '3i213Kl12s*@' });
  }

  public updateNoteTitle(title: string, id: number): Promise<HTTPResponse> {
    let url = 'https://luque21.duckdns.org:4085/notes/name/' + id;
    return this.http.put(url, { 'title': title }, { 'apikey': '3i213Kl12s*@' });
  }

  public shareNote(id_note: number, user: string): Promise<HTTPResponse> {
    let url = 'https://luque21.duckdns.org:4085/notes/shared/to';
    return this.http.post(url, { 'id_note': id_note, 'user': user }, { 'apikey': '3i213Kl12s*@' });
  }

  public unShareNoteTo(id_note: number, user: string): Promise<HTTPResponse> {
    let url = 'https://luque21.duckdns.org:4085/notes/' + id_note + '/unshared/to/' + user;
    return this.http.delete(url, {}, { 'apikey': '3i213Kl12s*@' });
  }

  public unShareNoteAll(id_note: number): Promise<HTTPResponse> {
    let url = 'https://luque21.duckdns.org:4085/notes/' + id_note + '/unshared/all';
    return this.http.delete(url, {}, { 'apikey': '3i213Kl12s*@' });
  }

  public deleteNote(id: number): Promise<HTTPResponse> {
    let url = 'https://luque21.duckdns.org:4085/notes/' + id;
    return this.http.delete(url, {}, { 'apikey': '3i213Kl12s*@' });
  }

  public createUser(email: string, password: string): Promise<HTTPResponse> {
    let url = 'https://luque21.duckdns.org:4085/users/register'
    return this.http.post(url, { 'user': email, 'pass': password }, { 'apikey': '3i213Kl12s*@' });
  }

  public getUser(email: string, pass: string): Promise<HTTPResponse> {
    let url = 'https://luque21.duckdns.org:4085/users/';
    return this.http.post(url, { 'email': email, 'pass': pass }, { 'apikey': '3i213Kl12s*@' });
  }




}
