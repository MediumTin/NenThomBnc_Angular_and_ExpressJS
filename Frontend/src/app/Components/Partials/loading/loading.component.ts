import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../Services/loading/loading.service';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent implements OnInit {

  isLoading!: boolean;
  constructor(loadingService: LoadingService) {
    loadingService.isLoading.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });


   }

  ngOnInit(): void {
  }

}
