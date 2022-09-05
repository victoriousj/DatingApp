import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TimeagoModule, TimeagoFormatter } from 'ngx-timeago';
import { ModalModule } from 'ngx-bootstrap/modal';
import MyTimegoFormatter from '../_helpers/MyTimeagoFormatter';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ToastrModule.forRoot({ positionClass: 'toast-bottom-right' }),
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxGalleryModule,
        FileUploadModule,
        BsDatepickerModule.forRoot(),
        PaginationModule.forRoot(),
        ButtonsModule.forRoot(),
        TimeagoModule.forRoot({ formatter: { provide: TimeagoFormatter, useClass: MyTimegoFormatter } }),
        ModalModule.forRoot(),
    ],
    exports: [
        BsDropdownModule,
        ToastrModule,
        TabsModule,
        NgxGalleryModule,
        FileUploadModule,
        BsDatepickerModule,
        PaginationModule,
        ButtonsModule,
        TimeagoModule,
        ModalModule,
    ],
})
export class SharedModule {}
