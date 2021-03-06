import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { AuthModule } from './authentication/auth.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { Page404Component, PageErrorComponent } from './page-404.component';

import { DragDropModule } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,  
    Page404Component,
    PageErrorComponent
  ],
  imports: [    
    BrowserAnimationsModule,
    DragDropModule,
    BrowserModule,
    HttpModule,    
    AuthModule,  
    AppRoutingModule    
  ],
  providers: [ ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
