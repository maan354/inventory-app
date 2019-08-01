import { Injectable, Sanitizer, SecurityContext } from '@angular/core';
import { Platform, ActionSheetController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class DeleteConfirmationPopover {

    constructor(private actionSheetController: ActionSheetController) { }

    public async showPopover(type: string, assignFunction: () => void) {
        const actionSheet = await this.actionSheetController.create({
            header: `Are you sure you want to delete this ${type}`,
            buttons: [
                {
                    text: 'Yes',
                    handler: assignFunction
                },
                {
                    text: 'No',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }
}