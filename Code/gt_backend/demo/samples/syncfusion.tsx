import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ButtonComponent, SwitchComponent, ChangeEventArgs as SwitchEventArgs } from '@syncfusion/ej2-react-buttons';
import { TimePickerComponent, ChangeEventArgs as TimeEventArgs } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent, ChangeEventArgs, MultiSelectComponent, MultiSelectChangeEventArgs, CheckBoxSelection } from '@syncfusion/ej2-react-dropdowns';
import { UploaderComponent, SelectedEventArgs, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import {
  ToolbarComponent, ItemsDirective, ItemDirective, BeforeOpenCloseMenuEventArgs,
  MenuEventArgs as ContextMenuEventArgs, MenuItemModel, ContextMenuComponent, ClickEventArgs
} from '@syncfusion/ej2-react-navigations';
import {
  ResourcesModel, ScheduleComponent, Day, Week, WorkWeek, Month, Year, TimelineViews, TimelineMonth, TimelineYear,
  ViewsDirective, ViewDirective, ResourcesDirective, ResourceDirective, Inject, Resize, DragAndDrop, Agenda, Print,
  ICalendarImport, ICalendarExport, CellClickEventArgs, Timezone, CurrentAction
} from '@syncfusion/ej2-react-schedule';
import { DropDownButtonComponent, ItemModel, MenuEventArgs } from '@syncfusion/ej2-react-splitbuttons';
import { addClass, Browser, closest, extend, Internationalization, isNullOrUndefined, removeClass, remove } from '@syncfusion/ej2-base';
import { DataManager, Predicate, Query } from '@syncfusion/ej2-data';
import { tz } from 'moment-timezone';
import { SampleBase } from '../common/sample-base';
import './overview.css';

export class Overview extends SampleBase<{}, {}> {
  private scheduleObj: ScheduleComponent;
  private eventTypeObj: DropDownListComponent;
  private titleObj: TextBoxComponent;
  private notesObj: TextBoxComponent;
  private contextMenuObj: ContextMenuComponent;
  private isTimelineView: boolean = false;
  private selectedTarget: Element;
  private targetElement: HTMLElement;
  private intl: Internationalization = new Internationalization();
  private weekDays: { [key: string]: Object }[] = [
    { text: 'Sunday', value: 0 },
    { text: 'Monday', value: 1 },
    { text: 'Tuesday', value: 2 },
    { text: 'Wednesday', value: 3 },
    { text: 'Thursday', value: 4 },
    { text: 'Friday', value: 5 },
    { text: 'Saturday', value: 6 }
  ];
  private exportItems: ItemModel[] = [
    { text: 'iCalendar', iconCss: 'e-icons e-schedule-ical-export' },
    { text: 'Excel', iconCss: 'e-icons e-schedule-excel-export' }
  ];
  private contextMenuItems: MenuItemModel[] = [
    { text: 'New Event', iconCss: 'e-icons new', id: 'Add' },
    { text: 'New Recurring Event', iconCss: 'e-icons recurrence', id: 'AddRecurrence' },
    { text: 'Today', iconCss: 'e-icons today', id: 'Today' },
    { text: 'Edit Event', iconCss: 'e-icons edit', id: 'Save' },
    { text: 'Delete Event', iconCss: 'e-icons delete', id: 'Delete' },
    {
      text: 'Delete Event', id: 'DeleteRecurrenceEvent', iconCss: 'e-icons delete',
      items: [
        { text: 'Delete Occurrence', id: 'DeleteOccurrence' },
        { text: 'Delete Series', id: 'DeleteSeries' }
      ]
    },
    {
      text: 'Edit Event', id: 'EditRecurrenceEvent', iconCss: 'e-icons edit',
      items: [
        { text: 'Edit Occurrence', id: 'EditOccurrence' },
        { text: 'Edit Series', id: 'EditSeries' }
      ]
    }
  ];
  private calendarCollections: Object[] = [
    { CalendarText: 'My Calendar', CalendarId: 1, CalendarColor: '#c43081' },
    { CalendarText: 'Company', CalendarId: 2, CalendarColor: '#ff7f50' },
    { CalendarText: 'Birthday', CalendarId: 3, CalendarColor: '#AF27CD' },
    { CalendarText: 'Holiday', CalendarId: 4, CalendarColor: '#808000' }
  ];
  private timezoneData: { [key: string]: Object }[] = [
    { text: 'UTC -12:00', value: 'Etc/GMT+12' },
    { text: 'UTC -11:00', value: 'Etc/GMT+11' },
    { text: 'UTC -10:00', value: 'Etc/GMT+10' },
    { text: 'UTC -09:00', value: 'Etc/GMT+9' },
    { text: 'UTC -08:00', value: 'Etc/GMT+8' },
    { text: 'UTC -07:00', value: 'Etc/GMT+7' },
    { text: 'UTC -06:00', value: 'Etc/GMT+6' },
    { text: 'UTC -05:00', value: 'Etc/GMT+5' },
    { text: 'UTC -04:00', value: 'Etc/GMT+4' },
    { text: 'UTC -03:00', value: 'Etc/GMT+3' },
    { text: 'UTC -02:00', value: 'Etc/GMT+2' },
    { text: 'UTC -01:00', value: 'Etc/GMT+1' },
    { text: 'UTC +00:00', value: 'Etc/GMT' },
    { text: 'UTC +01:00', value: 'Etc/GMT-1' },
    { text: 'UTC +02:00', value: 'Etc/GMT-2' },
    { text: 'UTC +03:00', value: 'Etc/GMT-3' },
    { text: 'UTC +04:00', value: 'Etc/GMT-4' },
    { text: 'UTC +05:00', value: 'Etc/GMT-5' },
    { text: 'UTC +05:30', value: 'Asia/Calcutta' },
    { text: 'UTC +06:00', value: 'Etc/GMT-6' },
    { text: 'UTC +07:00', value: 'Etc/GMT-7' },
    { text: 'UTC +08:00', value: 'Etc/GMT-8' },
    { text: 'UTC +09:00', value: 'Etc/GMT-9' },
    { text: 'UTC +10:00', value: 'Etc/GMT-10' },
    { text: 'UTC +11:00', value: 'Etc/GMT-11' },
    { text: 'UTC +12:00', value: 'Etc/GMT-12' },
    { text: 'UTC +13:00', value: 'Etc/GMT-13' },
    { text: 'UTC +14:00', value: 'Etc/GMT-14' }
  ];
  private majorSlotData: { [key: string]: Object }[] = [
    { Name: '1 hour', Value: 60 },
    { Name: '1.5 hours', Value: 90 },
    { Name: '2 hours', Value: 120 },
    { Name: '2.5 hours', Value: 150 },
    { Name: '3 hours', Value: 180 },
    { Name: '3.5 hours', Value: 210 },
    { Name: '4 hours', Value: 240 },
    { Name: '4.5 hours', Value: 270 },
    { Name: '5 hours', Value: 300 },
    { Name: '5.5 hours', Value: 330 },
    { Name: '6 hours', Value: 360 },
    { Name: '6.5 hours', Value: 390 },
    { Name: '7 hours', Value: 420 },
    { Name: '7.5 hours', Value: 450 },
    { Name: '8 hours', Value: 480 },
    { Name: '8.5 hours', Value: 510 },
    { Name: '9 hours', Value: 540 },
    { Name: '9.5 hours', Value: 570 },
    { Name: '10 hours', Value: 600 },
    { Name: '10.5 hours', Value: 630 },
    { Name: '11 hours', Value: 660 },
    { Name: '11.5 hours', Value: 690 },
    { Name: '12 hours', Value: 720 }
  ];
  private minorSlotData: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  private timeFormatData: { [key: string]: Object }[] = [
    { Name: "12 hours", Value: "hh:mm a" },
    { Name: "24 hours", Value: "HH:mm" }
  ];

  private weekNumberData: { [key: string]: Object }[] = [
    { Name: 'Off', Value: 'Off' },
    { Name: 'First Day of Year', Value: 'FirstDay' },
    { Name: 'First Full Week', Value: 'FirstFullWeek' },
    { Name: 'First Four-Day Week', Value: 'FirstFourDayWeek' }
  ];

  private updateLiveTime(): void {
    let scheduleTimezone: string = this.scheduleObj ? this.scheduleObj.timezone : 'Etc/GMT';
    let timeBtn: HTMLElement = document.querySelector('.schedule-overview #timeBtn') as HTMLElement;
    if (timeBtn) {
      timeBtn.innerHTML = '<span class="e-btn-icon e-icons e-schedule-clock e-icon-left"></span>' +
        new Date().toLocaleTimeString('en-US', { timeZone: scheduleTimezone });
    }
  };

  private onImportClick(args: SelectedEventArgs): void {
    this.scheduleObj.importICalendar(((args.event.target as HTMLInputElement).files as any)[0]);
  }

  private onPrint(): void {
    this.scheduleObj.print();
  }

  private onExportClick(args: MenuEventArgs): void {
    if (args.item.text === 'Excel') {
      let exportDatas: { [key: string]: Object }[] = [];
      let eventCollection: Object[] = this.scheduleObj.getEvents();
      let resourceCollection: ResourcesModel[] = this.scheduleObj.getResourceCollections();
      let resourceData: { [key: string]: Object }[] = resourceCollection[0].dataSource as { [key: string]: Object }[];
      for (let resource of resourceData) {
        let data: Object[] = eventCollection.filter((e: { [key: string]: Object }) => e.CalendarId === resource.CalendarId);
        exportDatas = exportDatas.concat(data as { [key: string]: Object }[]);
      }
      this.scheduleObj.exportToExcel({ exportType: 'xlsx', customData: exportDatas, fields: ['Id', 'Subject', 'StartTime', 'EndTime', 'CalendarId'] });
    } else {
      this.scheduleObj.exportToICalendar();
    }
  }

  private getEventData(): Object {
    const date: Date = this.scheduleObj.selectedDate;
    return {
      Id: this.scheduleObj.getEventMaxID(),
      Subject: '',
      StartTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours(), 0, 0),
      EndTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours() + 1, 0, 0),
      Location: '',
      Description: '',
      IsAllDay: false,
      CalendarId: 1
    };
  }


  private onToolbarItemClicked(args: ClickEventArgs): void {
    switch (args.item.text) {
      case 'Day':
        this.scheduleObj.currentView = this.isTimelineView ? 'TimelineDay' : 'Day';
        break;
      case 'Week':
        this.scheduleObj.currentView = this.isTimelineView ? 'TimelineWeek' : 'Week';
        break;
      case 'WorkWeek':
        this.scheduleObj.currentView = this.isTimelineView ? 'TimelineWorkWeek' : 'WorkWeek';
        break;
      case 'Month':
        this.scheduleObj.currentView = this.isTimelineView ? 'TimelineMonth' : 'Month';
        break;
      case 'Year':
        this.scheduleObj.currentView = this.isTimelineView ? 'TimelineYear' : 'Year';
        break;
      case 'Agenda':
        this.scheduleObj.currentView = 'Agenda';
        break;
      case 'New Event':
        const eventData: Object = this.getEventData();
        this.scheduleObj.openEditor(eventData, 'Add', true);
        break;
      case 'New Recurring Event':
        const recEventData: Object = this.getEventData();
        this.scheduleObj.openEditor(recEventData, 'Add', true, 1);
        break;
    }
  }


  private timelineTemplate(): JSX.Element {
    return (
      <div style={{ height: '46px', lineHeight: '23px' }}>
        <div className='icon-child' style={{ textAlign: 'center' }}>
          <SwitchComponent id='timeline_views' checked={false} change={(args: SwitchEventArgs) => {
            this.isTimelineView = args.checked as boolean;
            switch (this.scheduleObj.currentView) {
              case 'Day':
              case 'TimelineDay':
                this.scheduleObj.currentView = this.isTimelineView ? 'TimelineDay' : 'Day';
                break;
              case 'Week':
              case 'TimelineWeek':
                this.scheduleObj.currentView = this.isTimelineView ? 'TimelineWeek' : 'Week';
                break;
              case 'WorkWeek':
              case 'TimelineWorkWeek':
                this.scheduleObj.currentView = this.isTimelineView ? 'TimelineWorkWeek' : 'WorkWeek';
                break;
              case 'Month':
              case 'TimelineMonth':
                this.scheduleObj.currentView = this.isTimelineView ? 'TimelineMonth' : 'Month';
                break;
              case 'Year':
              case 'TimelineYear':
                this.scheduleObj.currentView = this.isTimelineView ? 'TimelineYear' : 'Year';
                break;
              case 'Agenda':
                this.scheduleObj.currentView = 'Agenda';
                break;
            }
          }} />
        </div>
        <div className='text-child' style={{ fontSize: '14px' }}>Timeline Views</div>
      </div >
    );
  }

  private multiDragTemplate(): JSX.Element {
    return (
      <div style={{ height: '46px', lineHeight: '23px' }}>
        <div className='icon-child' style={{ textAlign: 'center' }}>
          <SwitchComponent id='multi_drag' checked={false} change={(args: SwitchEventArgs) => { this.scheduleObj.allowMultiDrag = args.checked as boolean; }} />
        </div>
        <div className='text-child' style={{ fontSize: '14px' }}>Allow Multi Drag</div>
      </div>
    );
  }

  private groupTemplate(): JSX.Element {
    return (
      <div style={{ height: '46px', lineHeight: '23px' }}>
        <div className='icon-child' style={{ textAlign: 'center' }}>
          <SwitchComponent id='grouping' checked={true} change={(args: SwitchEventArgs) => { this.scheduleObj.group.resources = args.checked ? ['Calendars'] : []; }} />
        </div>
        <div className='text-child' style={{ fontSize: '14px' }}>Grouping</div>
      </div>
    );
  }

  private gridlineTemplate(): JSX.Element {
    return (
      <div style={{ height: '46px', lineHeight: '23px' }}>
        <div className='icon-child' style={{ textAlign: 'center' }}>
          <SwitchComponent id='gridlines' checked={true} change={(args: SwitchEventArgs) => { this.scheduleObj.timeScale.enable = args.checked as boolean; }} />
        </div>
        <div className='text-child' style={{ fontSize: '14px' }}>Gridlines</div>
      </div>
    );
  }

  private autoHeightTemplate(): JSX.Element {
    return (
      <div style={{ height: '46px', lineHeight: '23px' }}>
        <div className='icon-child' style={{ textAlign: 'center' }}>
          <SwitchComponent id='row_auto_height' checked={false} change={(args: SwitchEventArgs) => { this.scheduleObj.rowAutoHeight = args.checked as boolean; }} />
        </div>
        <div className='text-child' style={{ fontSize: '14px' }}>Row Auto Height</div>
      </div>
    );
  }

  private tooltipTemplate(): JSX.Element {
    return (
      <div style={{ height: '46px', lineHeight: '23px' }}>
        <div className='icon-child' style={{ textAlign: 'center' }}>
          <SwitchComponent id='tooltip' checked={false} change={(args: SwitchEventArgs) => { this.scheduleObj.eventSettings.enableTooltip = args.checked as boolean; }} />
        </div>
        <div className='text-child' style={{ fontSize: '14px' }}>Tooltip</div>
      </div>
    );
  }

  private getResourceData(data: { [key: string]: Object }): { [key: string]: Object } {
    let resources: ResourcesModel = this.scheduleObj.getResourceCollections().slice(-1)[0];
    let resourceData: { [key: string]: Object } = (resources.dataSource as Object[]).filter((resource: { [key: string]: Object }) =>
      resource.CalendarId === data.CalendarId)[0] as { [key: string]: Object };
    return resourceData;
  }


  private getHeaderStyles(data: { [key: string]: Object }): Object {
    if (data.elementType === 'event') {
      let resourceData: { [key: string]: Object } = this.getResourceData(data);
      return { background: resourceData.CalendarColor, color: '#FFFFFF' };
    } else {
      return { alignItems: 'center', color: '#919191' };
    }
  }

  public getHeaderTitle(data: { [key: string]: Object }): string {
    return (data.elementType === 'cell') ? 'Add Appointment' : 'Appointment Details';
  }

  public getHeaderDetails(data: { [key: string]: Date }): string {
    return this.intl.formatDate(data.StartTime, { type: 'date', skeleton: 'full' }) + ' (' +
      this.intl.formatDate(data.StartTime, { skeleton: 'hm' }) + ' - ' +
      this.intl.formatDate(data.EndTime, { skeleton: 'hm' }) + ')';

  }

  public getEventType(data: { [key: string]: string }): string {
    const resourceData: { [key: string]: Object } = this.getResourceData(data);
    return resourceData.CalendarText as string;
  }

  public buttonClickActions(e: Event) {
    const quickPopup: HTMLElement = this.scheduleObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
    const getSlotData: Function = (): { [key: string]: Object } => {
      const cellDetails: CellClickEventArgs = this.scheduleObj.getCellDetails(this.scheduleObj.getSelectedElements());
      const addObj: { [key: string]: Object } = {};
      addObj.Id = this.scheduleObj.getEventMaxID();
      addObj.Subject = this.titleObj.value;
      addObj.StartTime = new Date(+cellDetails.startTime);
      addObj.EndTime = new Date(+cellDetails.endTime);
      addObj.Description = this.notesObj.value;
      addObj.CalendarId = this.eventTypeObj.value;
      return addObj;
    };
    if ((e.target as HTMLElement).id === 'add') {
      const addObj: { [key: string]: Object } = getSlotData();
      this.scheduleObj.addEvent(addObj);
    } else if ((e.target as HTMLElement).id === 'delete') {
      const eventDetails: { [key: string]: Object } = this.scheduleObj.activeEventData.event as { [key: string]: Object };
      let currentAction: CurrentAction = 'Delete';
      if (eventDetails.RecurrenceRule) {
        currentAction = 'DeleteOccurrence';
      }
      this.scheduleObj.deleteEvent(eventDetails, currentAction);
    } else {
      const isCellPopup: boolean = (quickPopup.firstElementChild as HTMLElement).classList.contains('e-cell-popup');
      const eventDetails: { [key: string]: Object } = isCellPopup ? getSlotData() :
        this.scheduleObj.activeEventData.event as { [key: string]: Object };
      let currentAction: CurrentAction = isCellPopup ? 'Add' : 'Save';
      if (eventDetails.RecurrenceRule) {
        currentAction = 'EditOccurrence';
      }
      this.scheduleObj.openEditor(eventDetails, currentAction, true);
    }
    this.scheduleObj.closeQuickInfoPopup();
  }

  public headerTemplate(props: { [key: string]: Date }): JSX.Element {
    return (
      <div className="quick-info-header">
        <div className="quick-info-header-content" style={this.getHeaderStyles(props)}>
          <div className="quick-info-title">{this.getHeaderTitle(props)}</div>
          <div className="duration-text">{this.getHeaderDetails(props)}</div>
        </div>
      </div>
    );
  }

  public contentTemplate(props: { [key: string]: string }): JSX.Element {
    return (
      <div className="quick-info-content">
        {props.elementType === 'cell' ?
          <div className="e-cell-content">
            <div className="content-area">
              <TextBoxComponent id="title" ref={(textbox: TextBoxComponent) => this.titleObj = textbox} placeholder="Title" />
            </div>
            <div className="content-area">
              <DropDownListComponent id="eventType" ref={(ddl: DropDownListComponent) => this.eventTypeObj = ddl} dataSource={this.calendarCollections as { [key: string]: Object }[]}
                fields={{ text: "CalendarText", value: "CalendarId" }} placeholder="Choose Type" index={0} popupHeight="200px" />
            </div>
            <div className="content-area">
              <TextBoxComponent id="notes" ref={(textbox: TextBoxComponent) => this.notesObj = textbox} placeholder="Notes" />
            </div>
          </div>
          :
          <div className="event-content">
            <div className="meeting-type-wrap">
              <label>Subject</label>:
              <span>{props.Subject}</span>
            </div>
            <div className="meeting-subject-wrap">
              <label>Type</label>:
              <span>{this.getEventType(props)}</span>
            </div>
            <div className="notes-wrap">
              <label>Notes</label>:
              <span>{props.Description}</span>
            </div>
          </div>
        }
      </div>
    );
  }

  public footerTemplate(props: { [key: string]: Object }): JSX.Element {
    return (
      <div className="quick-info-footer">
        {props.elementType == "cell" ?
          <div className="cell-footer">
            <ButtonComponent id="more-details" cssClass='e-flat' content="More Details" onClick={this.buttonClickActions.bind(this)} />
            <ButtonComponent id="add" cssClass='e-flat' content="Add" isPrimary={true} onClick={this.buttonClickActions.bind(this)} />
          </div>
          :
          <div className="event-footer">
            <ButtonComponent id="delete" cssClass='e-flat' content="Delete" onClick={this.buttonClickActions.bind(this)} />
            <ButtonComponent id="more-details" cssClass='e-flat' content="More Details" isPrimary={true} onClick={this.buttonClickActions.bind(this)} />
          </div>
        }
      </div>
    );
  }

  private onResourceChange(args: MultiSelectChangeEventArgs): void {
    let resourcePredicate: Predicate & any;
    for (let value of args.value) {
      if (resourcePredicate) {
        resourcePredicate = resourcePredicate.or(new Predicate('CalendarId', 'equal', value));
      } else {
        resourcePredicate = new Predicate('CalendarId', 'equal', value);
      }
    }
    this.scheduleObj.resources[0].query = resourcePredicate ? new Query().where(resourcePredicate) : new Query().where('CalendarId', 'equal', 1);
  }

  public render() {
    let generateEvents: Function = (): Object[] => {
      let eventData: Object[] = [];
      let eventSubjects: string[] = [
        'Bering Sea Gold', 'Technology', 'Maintenance', 'Meeting', 'Travelling', 'Annual Conference', 'Birthday Celebration',
        'Farewell Celebration', 'Wedding Aniversary', 'Alaska: The Last Frontier', 'Deadest Catch', 'Sports Day', 'MoonShiners',
        'Close Encounters', 'HighWay Thru Hell', 'Daily Planet', 'Cash Cab', 'Basketball Practice', 'Rugby Match', 'Guitar Class',
        'Music Lessons', 'Doctor checkup', 'Brazil - Mexico', 'Opening ceremony', 'Final presentation'
      ];
      let weekDate: Date = new Date(new Date().setDate(new Date().getDate() - new Date().getDay()));
      let startDate: Date = new Date(weekDate.getFullYear(), weekDate.getMonth(), weekDate.getDate(), 10, 0);
      let endDate: Date = new Date(weekDate.getFullYear(), weekDate.getMonth(), weekDate.getDate(), 11, 30);
      eventData.push({
        Id: 1,
        Subject: eventSubjects[Math.floor(Math.random() * (24 - 0 + 1) + 0)],
        StartTime: startDate,
        EndTime: endDate,
        Location: '',
        Description: 'Event Scheduled',
        RecurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;COUNT=10;',
        IsAllDay: false,
        IsReadonly: false,
        CalendarId: 1
      });
      for (let a: number = 0, id: number = 2; a < 500; a++) {
        let month: number = Math.floor(Math.random() * (11 - 0 + 1) + 0);
        let date: number = Math.floor(Math.random() * (28 - 1 + 1) + 1);
        let hour: number = Math.floor(Math.random() * (23 - 0 + 1) + 0);
        let minutes: number = Math.floor(Math.random() * (59 - 0 + 1) + 0);
        let start: Date = new Date(new Date().getFullYear(), month, date, hour, minutes, 0);
        let end: Date = new Date(start.getTime());
        end.setHours(end.getHours() + 2);
        let startDate: Date = new Date(start.getTime());
        let endDate: Date = new Date(end.getTime());
        eventData.push({
          Id: id,
          Subject: eventSubjects[Math.floor(Math.random() * (24 - 0 + 1) + 0)],
          StartTime: startDate,
          EndTime: endDate,
          Location: '',
          Description: 'Event Scheduled',
          IsAllDay: id % 10 === 0,
          IsReadonly: endDate < new Date(),
          CalendarId: (a % 4) + 1
        });
        id++;
      }
      if (Browser.isIE) {
        Timezone.prototype.offset = (date: Date, timezone: string): number => tz.zone(timezone).utcOffset(date.getTime());
      }
      let overviewEvents: { [key: string]: Date }[] = extend([], eventData, undefined, true) as { [key: string]: Date }[];
      let timezone: Timezone = new Timezone();
      let currentTimezone: never = timezone.getLocalTimezoneName() as never;
      for (let event of overviewEvents) {
        event.StartTime = timezone.convert(event.StartTime, 'UTC', currentTimezone);
        event.EndTime = timezone.convert(event.EndTime, 'UTC', currentTimezone);
      }
      return overviewEvents;
    };
    return (
      <div className='schedule-control-section'>
        <div className='col-lg-12 control-section'>
          <div className='content-wrapper'>
            <div className='schedule-overview'>
              <div className='overview-header'>
                <div className='overview-titlebar'>
                  <div className='left-panel'>
                    <div className='schedule-overview-title' style={{ border: '1px solid transparent' }}>Scheduler Overview Functionalities</div>
                  </div>
                  <div className='center-panel'>
                    <ButtonComponent id='timezoneBtn' cssClass='title-bar-btn' iconCss='e-icons e-schedule-timezone' disabled={true} content='UTC' />
                    <ButtonComponent id='timeBtn' cssClass='title-bar-btn' iconCss='e-icons e-schedule-clock' disabled={true} content='Time' />
                  </div>
                  <div className='right-panel'>
                    <div className='control-panel'>
                      <ButtonComponent id='printBtn' cssClass='title-bar-btn' iconCss='e-icons e-schedule-print' onClick={(this.onPrint.bind(this))} content='Print' />
                    </div>
                    <div className='control-panel' style={{ display: 'inline-flex', paddingLeft: '15px' }}>
                      <div className='e-icons e-schedule-import e-btn-icon e-icon-left' style={{ lineHeight: '40px' }}></div>
                      <UploaderComponent id='fileUpload' type='file' allowedExtensions='.ics' cssClass='calendar-import'
                        buttons={{ browse: 'Import' }} multiple={false} showFileList={false} selected={(this.onImportClick.bind(this))} />
                    </div>
                    <div className='control-panel'>
                      <DropDownButtonComponent id='exporting' content='Export' items={this.exportItems} select={this.onExportClick.bind(this)} />
                    </div>
                  </div>
                </div>
              </div>
              <div className='overview-toolbar'>
                <div style={{ height: '70px', width: 'calc(100% - 90px)' }}>
                  <ToolbarComponent id='toolbar_options' width='100%' height={70} overflowMode='Scrollable' scrollStep={100} created={() => setInterval(() => { this.updateLiveTime(); }, 1000)} clicked={this.onToolbarItemClicked.bind(this)}>
                    <ItemsDirective>
                      <ItemDirective prefixIcon='e-icons e-schedule-add-event' tooltipText='New Event' text='New Event' />
                      <ItemDirective prefixIcon='e-icons e-schedule-add-recurrence-event' tooltipText='New Recurring Event' text='New Recurring Event' />
                      <ItemDirective type='Separator' />
                      <ItemDirective prefixIcon='e-icons e-schedule-day-view' tooltipText='Day' text='Day' />
                      <ItemDirective prefixIcon='e-icons e-schedule-week-view' tooltipText='Week' text='Week' />
                      <ItemDirective prefixIcon='e-icons e-schedule-workweek-view' tooltipText='WorkWeek' text='WorkWeek' />
                      <ItemDirective prefixIcon='e-icons e-schedule-month-view' tooltipText='Month' text='Month' />
                      <ItemDirective prefixIcon='e-icons e-schedule-year-view' tooltipText='Year' text='Year' />
                      <ItemDirective prefixIcon='e-icons e-schedule-agenda-view' tooltipText='Agenda' text='Agenda' />
                      <ItemDirective tooltipText='Timeline Views' text='Timeline Views' template={this.timelineTemplate.bind(this)} />
                      <ItemDirective type='Separator' />
                      <ItemDirective tooltipText='Grouping' text='Grouping' template={this.groupTemplate.bind(this)} />
                      <ItemDirective tooltipText='Gridlines' text='Gridlines' template={this.gridlineTemplate.bind(this)} />
                      <ItemDirective tooltipText='Row Auto Height' text='Row Auto Height' template={this.autoHeightTemplate.bind(this)} />
                      <ItemDirective tooltipText='Tooltip' text='Tooltip' template={this.tooltipTemplate.bind(this)} />
                      <ItemDirective tooltipText='Allow Multi Drag' text='Allow Multi Drag' template={this.multiDragTemplate.bind(this)} />
                    </ItemsDirective>
                  </ToolbarComponent>
                </div>
                <div style={{ height: '70px', width: '90px' }}>
                  <ButtonComponent id='settingsBtn' cssClass='overview-toolbar-settings' iconCss='e-icons e-schedule-toolbar-settings' iconPosition='Top' content='Settings' onClick={() => {
                    let settingsPanel: Element = document.querySelector('.overview-content .right-panel') as Element;
                    if (settingsPanel.classList.contains('hide')) {
                      removeClass([settingsPanel], 'hide');
                    } else {
                      addClass([settingsPanel], 'hide');
                    }
                    this.scheduleObj.refreshEvents();
                  }} />
                </div>
              </div>
              <div className='overview-content'>
                <div className='left-panel'>
                  <div className='overview-scheduler'>
                    <ScheduleComponent id='scheduler' cssClass='schedule-overview' ref={(schedule: ScheduleComponent) => this.scheduleObj = schedule} width='100%' height='100%'
                      group={{ resources: ['Calendars'] }} timezone='UTC' eventSettings={{ dataSource: generateEvents() }} quickInfoTemplates={{
                        header: this.headerTemplate.bind(this),
                        content: this.contentTemplate.bind(this),
                        footer: this.footerTemplate.bind(this)
                      }} >
                      <ResourcesDirective>
                        <ResourceDirective field='CalendarId' title='Calendars' name='Calendars' dataSource={this.calendarCollections}
                          query={new Query().where('CalendarId', 'equal', 1)} textField='CalendarText' idField='CalendarId' colorField='CalendarColor'>
                        </ResourceDirective>
                      </ResourcesDirective>
                      < ViewsDirective >
                        <ViewDirective option='Day' />
                        <ViewDirective option='Week' />
                        <ViewDirective option='WorkWeek' />
                        <ViewDirective option='Month' />
                        <ViewDirective option='Year' />
                        <ViewDirective option='Agenda' />
                        <ViewDirective option='TimelineDay' />
                        <ViewDirective option='TimelineWeek' />
                        <ViewDirective option='TimelineWorkWeek' />
                        <ViewDirective option='TimelineMonth' />
                        <ViewDirective option='TimelineYear' />
                      </ViewsDirective>
                      <Inject services={[Day, Week, WorkWeek, Month, Year, Agenda, TimelineViews, TimelineMonth, TimelineYear, DragAndDrop, Resize, Print, ICalendarImport, ICalendarExport]} />
                    </ScheduleComponent>
                    <ContextMenuComponent id='ContextMenu' cssClass='schedule-context-menu' ref={(menu: ContextMenuComponent) => this.contextMenuObj = menu} target='.e-schedule' items={this.contextMenuItems}
                      beforeOpen={(args: BeforeOpenCloseMenuEventArgs) => {
                        let newEventElement: HTMLElement = document.querySelector('.e-new-event') as HTMLElement;
                        if (newEventElement) {
                          remove(newEventElement);
                          removeClass([document.querySelector('.e-selected-cell') as Element], 'e-selected-cell');
                        }
                        this.targetElement = args.event.target as HTMLElement;
                        if (closest(this.targetElement, '.e-contextmenu')) {
                          return;
                        }
                        this.selectedTarget = closest(this.targetElement, '.e-appointment,.e-work-cells,.e-vertical-view .e-date-header-wrap .e-all-day-cells,.e-vertical-view .e-date-header-wrap .e-header-cells');
                        if (isNullOrUndefined(this.selectedTarget)) {
                          args.cancel = true;
                          return;
                        }
                        if (this.selectedTarget.classList.contains('e-appointment')) {
                          let eventObj: { [key: string]: Object } = this.scheduleObj.getEventDetails(this.selectedTarget) as { [key: string]: Object };
                          if (eventObj.RecurrenceRule) {
                            this.contextMenuObj.showItems(['EditRecurrenceEvent', 'DeleteRecurrenceEvent'], true);
                            this.contextMenuObj.hideItems(['Add', 'AddRecurrence', 'Today', 'Save', 'Delete'], true);
                          } else {
                            this.contextMenuObj.showItems(['Save', 'Delete'], true);
                            this.contextMenuObj.hideItems(['Add', 'AddRecurrence', 'Today', 'EditRecurrenceEvent', 'DeleteRecurrenceEvent'], true);
                          }
                          return;
                        }
                        this.contextMenuObj.hideItems(['Save', 'Delete', 'EditRecurrenceEvent', 'DeleteRecurrenceEvent'], true);
                        this.contextMenuObj.showItems(['Add', 'AddRecurrence', 'Today'], true);
                      }} select={(args: ContextMenuEventArgs) => {
                        let selectedMenuItem: string = args.item.id as string;
                        let eventObj: { [key: string]: Object } = {};
                        if (this.selectedTarget && this.selectedTarget.classList.contains('e-appointment')) {
                          eventObj = this.scheduleObj.getEventDetails(this.selectedTarget) as { [key: string]: Object };
                        }
                        switch (selectedMenuItem) {
                          case 'Today':
                            this.scheduleObj.selectedDate = new Date();
                            break;
                          case 'Add':
                          case 'AddRecurrence':
                            let selectedCells: Element[] = this.scheduleObj.getSelectedElements();
                            let activeCellsData: CellClickEventArgs = this.scheduleObj.getCellDetails(this.targetElement) ||
                            this.scheduleObj.getCellDetails(selectedCells.length > 0 ? selectedCells : this.selectedTarget);
                            if (selectedMenuItem === 'Add') {
                              this.scheduleObj.openEditor(activeCellsData, 'Add');
                            } else {
                              this.scheduleObj.openEditor(activeCellsData, 'Add', false, 1);
                            }
                            break;
                          case 'Save':
                          case 'EditOccurrence':
                          case 'EditSeries':
                            if (selectedMenuItem === 'EditSeries') {
                              let query: Query = new Query().where(this.scheduleObj.eventFields.id as string, 'equal', eventObj.RecurrenceID as string | number);
                              eventObj = new DataManager(this.scheduleObj.eventsData).executeLocal(query)[0] as { [key: string]: Object };
                            }
                            this.scheduleObj.openEditor(eventObj, selectedMenuItem);
                            break;
                          case 'Delete':
                            this.scheduleObj.deleteEvent(eventObj);
                            break;
                          case 'DeleteOccurrence':
                          case 'DeleteSeries':
                            this.scheduleObj.deleteEvent(eventObj, selectedMenuItem);
                            break;
                        }
                      }}>
                    </ContextMenuComponent>
                  </div>
                </div>
                <div className='right-panel hide'>
                  <div className='control-panel e-css'>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>First Day of Week</label>
                      </div>
                      <div className='col-right'>
                        <DropDownListComponent id="weekFirstDay" width={170} dataSource={this.weekDays} fields={{ text: 'text', value: 'value' }} value={0}
                          popupHeight={150} change={(args: ChangeEventArgs) => { this.scheduleObj.firstDayOfWeek = args.value as number; }} />
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Work week</label>
                      </div>
                      <div className='col-right'>
                        <MultiSelectComponent id="workWeekDays" cssClass='schedule-workweek' width={170} dataSource={this.weekDays} mode='CheckBox'
                          fields={{ text: 'text', value: 'value' }} enableSelectionOrder={false} showClearButton={false} showDropDownIcon={true}
                          popupHeight={150} value={[1, 2, 3, 4, 5]} change={(args: MultiSelectChangeEventArgs) => this.scheduleObj.workDays = args.value as number[]}>
                          <Inject services={[CheckBoxSelection]} />
                        </MultiSelectComponent>
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Resources</label>
                      </div>
                      <div className='col-right'>
                        <MultiSelectComponent id="resources" cssClass='schedule-resource' width={170} dataSource={this.calendarCollections as { [key: string]: Object }[]}
                          mode='CheckBox' fields={{ text: 'CalendarText', value: 'CalendarId' }} enableSelectionOrder={false} showClearButton={false} showDropDownIcon={true}
                          popupHeight={150} value={[1]} change={this.onResourceChange.bind(this)}>
                          <Inject services={[CheckBoxSelection]} />
                        </MultiSelectComponent>
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Timezone</label>
                      </div>
                      <div className='col-right'>
                        <DropDownListComponent id="timezone" width={170} dataSource={this.timezoneData} fields={{ text: 'text', value: 'value' }} value='Etc/GMT'
                          popupHeight={150} change={(args: ChangeEventArgs) => {
                            this.scheduleObj.timezone = args.value as string;
                            this.updateLiveTime();
                            (document.querySelector('.schedule-overview #timezoneBtn') as HTMLElement).innerHTML =
                              '<span class="e-btn-icon e-icons e-schedule-timezone e-icon-left"></span>' + args.itemData.text;
                          }} />
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Day Start Hour</label>
                      </div>
                      <div className='col-right'>
                        <TimePickerComponent id='dayStartHour' width={170} showClearButton={false} value={new Date(new Date().setHours(0, 0, 0))}
                          change={(args: TimeEventArgs) => this.scheduleObj.startHour = this.intl.formatDate(args.value as Date, { skeleton: 'Hm' })} />
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Day End Hour</label>
                      </div>
                      <div className='col-right'>
                        <TimePickerComponent id='dayEndHour' width={170} showClearButton={false} value={new Date(new Date().setHours(23, 59, 59))}
                          change={(args: TimeEventArgs) => this.scheduleObj.endHour = this.intl.formatDate(args.value as Date, { skeleton: 'Hm' })} />
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Work Start Hour</label>
                      </div>
                      <div className='col-right'>
                        <TimePickerComponent id='workHourStart' width={170} showClearButton={false} value={new Date(new Date().setHours(9, 0, 0))}
                          change={(args: TimeEventArgs) => this.scheduleObj.workHours.start = this.intl.formatDate(args.value as Date, { skeleton: 'Hm' })} />
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Work End Hour</label>
                      </div>
                      <div className='col-right'>
                        <TimePickerComponent id='workHourEnd' width={170} showClearButton={false} value={new Date(new Date().setHours(18, 0, 0))}
                          change={(args: TimeEventArgs) => this.scheduleObj.workHours.end = this.intl.formatDate(args.value as Date, { skeleton: 'Hm' })} />
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Slot Duration</label>
                      </div>
                      <div className='col-right'>
                        <DropDownListComponent id="slotDuration" width={170} dataSource={this.majorSlotData} fields={{ text: 'Name', value: 'Value' }} value={60}
                          popupHeight={150} change={(args: ChangeEventArgs) => { this.scheduleObj.timeScale.interval = args.value as number; }} />
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Slot Interval</label>
                      </div>
                      <div className='col-right'>
                        <DropDownListComponent id="slotInterval" width={170} dataSource={this.minorSlotData} value={2} popupHeight={150}
                          change={(args: ChangeEventArgs) => { this.scheduleObj.timeScale.slotCount = args.value as number; }} />
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Time Format</label>
                      </div>
                      <div className='col-right'>
                        <DropDownListComponent id="timeFormat" width={170} dataSource={this.timeFormatData} fields={{ text: 'Name', value: 'Value' }} value={"hh:mm a"} popupHeight={150}
                          change={(args: ChangeEventArgs) => { this.scheduleObj.timeFormat = args.value as any; }} />
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Week Numbers</label>
                      </div>
                      <div className='col-right'>
                        <DropDownListComponent id="weekNumber" width={170} dataSource={this.weekNumberData} fields={{ text: 'Name', value: 'Value' }} value={"Off"} popupHeight={150}
                          change={(args: ChangeEventArgs) => {
                            if (args.value == "Off") {
                              this.scheduleObj.showWeekNumber = false;
                            } else {
                              this.scheduleObj.showWeekNumber = true;
                              this.scheduleObj.weekRule = args.value as any;
                            }
                          }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
      </div>
    );
  }
}