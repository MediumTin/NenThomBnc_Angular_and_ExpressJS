import { Component, OnInit } from '@angular/core';
import { CandlesServiceService } from '../../../Services/CandlesService/candles-service.service';
import { Tag } from '../../../Common_Configuration/Models/Tag';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tags',
  imports: [CommonModule,RouterModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent implements OnInit {
  tags?:Tag[];
  constructor(CandleService:CandlesServiceService) {
    CandleService.getAllTags().subscribe(serverTags => {
      this.tags = serverTags;
    });
   }

  ngOnInit(): void {
  }

}
