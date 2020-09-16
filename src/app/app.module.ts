import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseMenuComponent } from './base-menu/base-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreferedMenuComponent } from './prefered-menu/prefered-menu.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { RoleSelectorComponent } from './role-selector/role-selector.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { BtnAssignComponent } from './btn-assign/btn-assign.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';


@NgModule({
  declarations: [
    AppComponent,
    BaseMenuComponent,
    PreferedMenuComponent,
    RoleSelectorComponent,
    BtnAssignComponent
  ],
  imports: [
	
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
	MatTreeModule,
	MatIconModule,
	MatInputModule,
	MatButtonModule,
	MatSelectModule,
	MatRadioModule,
	MatCardModule,
	ReactiveFormsModule,
	StoreModule.forRoot(reducers, {
      metaReducers
    })
	
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
