import { LOCALE_ID, NgModule } from "@angular/core";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';



import localePy from '@angular/common/locales/es-BO'
import { registerLocaleData } from "@angular/common";
registerLocaleData(localePy, 'es')


@NgModule({
    declarations:[],
    imports:[],
    exports:[TableModule,
            CommonModule,
            ButtonModule,
            DialogModule,
            InputTextModule, 
            DynamicDialogModule,
            CalendarModule,
            DropdownModule,
            FieldsetModule,
            RadioButtonModule,
            InputSwitchModule,
            FloatLabelModule,
            AutoCompleteModule,
            DividerModule,
            MessagesModule
        ],
    providers:[{ provide: LOCALE_ID, useValue:'es'}],
    


})

export class MaterialModule{

    

}

