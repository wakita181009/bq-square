import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import {DataSource} from '@angular/cdk/table';
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

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.table_schema = this.data.result && this.data.result['schema'];
    this.table_data = this.data.result && this.data.result['data'];
    this.table_schema_name = (this.data.format && this.data.format['schema_name']) || this.table_schema;
    this.displayedColumns = (this.data.format && this.data.format['schema']) || this.table_schema;
    this.table_data$ = new DataTableDataSource(this.table_data);
    this.changeDetector.detectChanges();
  }

}

class DataTableDataSource extends DataSource<any> {


  constructor(private _data: any) {
    super();
  }

  connect() {
    return Observable.of(this._data);
  }

  disconnect() {
  }
}
