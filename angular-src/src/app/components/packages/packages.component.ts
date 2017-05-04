import { Component } from '@angular/core';
import { PackagesService } from '../../services/packages.service';
import { Packages } from '../../../Packages';

@Component({
  selector: 'packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent  {

  packages: Packages[];




  constructor(private packagesService:PackagesService) {
    this.packagesService.getPackages().subscribe(packages => {
      var user;
      var retrivedSavedUser = localStorage.getItem("user");
      var parsedSavedUser = JSON.parse(retrivedSavedUser);

      for (var i = 0; i < packages.length; i++) {
        if (packages[i].username == parsedSavedUser.username) {
          user = packages[i].packages
        }
      }

      console.log(user);
      this.packages = user;
    });

  }


}
