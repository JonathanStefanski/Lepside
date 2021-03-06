import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable, Subject } from 'rxjs/Rx';

import { User, RegisterBindingModel } from './auth.model';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
    private baseUrl = `${environment.apiUrl}api/account`;
    currentUser: User;
    redirectUrl: string;   

    constructor(private _http: Http) { 
        this.currentUser = JSON.parse(localStorage.getItem('_currentUser'));  
    }

    private extractData(response: Response) {        
        const body = response.json();
        return body || {};
    }    

    private _handleError(err: any) {
        console.log(err);
        return Observable.throw(err);
    }

    refreshRoles(): void {        
        const bearer = this.currentUser == null ? '' : this.currentUser.access_token;
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${bearer}` });
        const options = new RequestOptions({ headers: headers });

        const url = `${this.baseUrl}/RefreshRoles`;

        this._http.get(url, options)       
        .map(this.extractData) 
        .catch(this._handleError)
        .subscribe((response) => {
            this.currentUser.roles = response;
            localStorage.setItem('_currentUser', JSON.stringify(this.currentUser));
        });
    }

    isLoggedIn(): boolean {
        return !!this.currentUser;
    }

    isInRole(role: string): boolean {
        if (this.currentUser == null || this.currentUser.roles == null) return false;
        return this.currentUser.roles.map(r => r.toLowerCase()).indexOf(role.toLowerCase()) > -1;
    }

    login(userName: string, password: string): Observable<boolean> {
        const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const options = new RequestOptions({ headers: headers });
        const url = environment.apiUrl  + 'Token';

        const data = new URLSearchParams();
        data.append('username', userName);
        data.append('password', password);
        data.append('grant_type', 'password');
        
        return this._http.post(url, data, options)        
        .map((response: Response) => {
            const userInfo = this.extractData(response);                        
            if (userInfo) {
                this.currentUser = userInfo;          
                this.currentUser.roles = JSON.parse(userInfo['roles']);                
                localStorage.setItem('_currentUser', JSON.stringify(this.currentUser));
                return true;
            } else {
                return false;
            }
        })
        .catch(this._handleError);
    }

    logout(): void {
        this.currentUser = null;
        localStorage.removeItem('_currentUser');
    }

    checkName(userName: string): Observable<boolean> {
        const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const options = new RequestOptions({ headers: headers });
        const url = `${this.baseUrl}/CheckUsername`;

        const data = new URLSearchParams();
        data.append('userName', userName);
       
        return this._http.post(url, data, options)  
            .map((r) => r.ok)
            .catch(err => {               
                return Observable.of(<Response>err).map((r) => r.ok);
            });
    }

    register(model: RegisterBindingModel): Observable<boolean> {
        const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const options = new RequestOptions({ headers: headers });
        const url = `${this.baseUrl}/Register`;

        const data = new URLSearchParams();
        data.append('userName', model.username);
        data.append('email', model.email);
        data.append('gender', model.gender.toString());
        data.append('password', model.password);
        data.append('confirmPassword', model.confirmPassword);

        return this._http.post(url, data, options)  
            .map((r) => r.ok)
            .catch(err => {               
                return Observable.of(<Response>err).map((r) => r.ok);
            });
    }
}
