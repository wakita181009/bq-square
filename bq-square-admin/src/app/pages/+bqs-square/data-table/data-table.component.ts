import {Component, OnInit, Input, ChangeDetectorRef, ViewChild} from '@angular/core';
import {DataSource} from '@angular/cdk/table';
import {MatPaginator} from '@angular/material';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'data-table-component',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  @Input() data: any;
  table_schema_name: string[];
  table_schema: string[];
  table_data: string[];
  table_sort: boolean = false;
  table_rowsPerPage: number = 10;

  table_data$: DataTableDataSource | null;
  displayedColumns: string[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.table_schema = this.data.result && this.data.result['schema'];
    this.table_data = this.data.result && this.data.result['data'];
    this.table_schema_name = (this.data.format && this.data.format['schema_name']) || this.table_schema;
    this.displayedColumns = (this.data.format && this.data.format['schema']) || this.table_schema;
    this.table_data$ = new DataTableDataSource(this.table_data, this.paginator);
    this.changeDetector.detectChanges();

    console.log(this.table_data.length)
  }

  is_number(obj) {
    return typeof obj === 'number'
  }

}

class DataTableDataSource extends DataSource<any> {


  constructor(private _data: any, private _paginator: MatPaginator) {
    super();
  }

  connect() {
    const displayDataChanges = [
      Observable.of(this._data),
      this._paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this._data.slice();
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() {
  }

}
