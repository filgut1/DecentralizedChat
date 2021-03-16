import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class AlertService {

    constructor(public toastController: ToastController) {}
    // convenience methods
    success(message: string, options?: any) {
        this.presentToast(message);
    }

    error(message: string, options?: any) {
        this.presentToast(message);
    }

    info(message: string, options?: any) {
        this.presentToast(message);
    }

    warn(message: string, options?: any) {
        this.presentToast(message);
    }

  
    async presentToast(message) {
        const toast = await this.toastController.create({
          message: message,
          duration: 2000
        });
        toast.present();
      }
    
}