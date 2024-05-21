import { NgModule } from "@angular/core";
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
            InputSwitchModule
        ],
    providers:[],
    


})

export class MaterialModule{

    

}

