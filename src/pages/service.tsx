

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Calendar, dateFnsLocalizer, Event, Views } from "react-big-calendar";
import withDragAndDrop, {
  withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import { addHours } from "date-fns/addHours";
import { startOfHour } from "date-fns/startOfHour";
import {
  UserPlus,
  Gauge,
  CalendarPlus,
  ChevronsLeft,
  Banknote,
  Phone,
  CalendarCheck,
  ChevronsRight,
  Truck,
  ArrowLeft,
  ArrowDownToDot,
  ArrowRight,
  ClipboardCheck,
  Clipboard,
  X,
  ChevronRightIcon,
  ChevronLeftIcon,
  Copy,
  CalendarIcon,
  Check,
} from "lucide-react";
import {
  Button,
  buttonVariants,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Separator,
} from "../components/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  useScreenSize,
  ViewNamesGroup,
  CustomToolbar,
  mobileToolbar,
  noToolbar,
  colors,
  IEventInfo,
  resourceTitle,

  EventFormData,
  DatePickerEventFormData,
  initialEventFormState,
  initialDatePickerEventFormData,
  IProps,
  ViewToolbar,
  AgendaTime,
  AgendaDate,
  AppointmentInfo,
  UpdateCompeltedAppt,
} from "../components/shared";
import { Calendar as SmallCalendar } from "../components/ui/calendar";
import { Calendar as SecondCalendar } from "../components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
//import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
//import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import "../styles/sonner.css";
import "../styles/calendarMargin.css";
import "../styles/rbc.css";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_APP_URL = import.meta.env.VITE_APP_URL;

const Service: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState();
  const [techs, setTechs] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(); // true
  const [selectedResource, setSelectedResource] = useState(1); // 1
  const [view, setView] = useState();
  const [showResources, setShowResources] = useState(false); // false
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const onView = useCallback((newView) => setView(newView), [setView]);
  const [changeToAppt, setChangeToAppt] = useState(false);
  const [scheduleFUP, setScheduleFUP] = useState(false);

  useEffect(() => {
    onView(Views.DAY);
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setEventInfoModal(false);
        setSelectedResource(1);
        setShowResources(false);
        onView(Views.DAY);
      }
      if (window.innerWidth > 768) {
        //  HandleSelectEventCell(false);
        setShowResources(true);
        setSelectedResource(0);
        onView(Views.WEEK);
      }
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isSmallScreen) {
      setShowResources(false);
      onView(Views.DAY);
      setSelectedResource(1);
    } else {
      setSelectedResource(0);
      onView(Views.WEEK);
      setShowResources(true);
    }
  }, [isSmallScreen]);

  useEffect(() => {
    async function fetchData() {
      console.log(VITE_API_URL, "VITE_API_URL useEffect");
      try {
        const response = await axios.get(`${VITE_API_URL}/service/calendar/all`);

        const data = response;
      console.log("hit axios", data);
        
        setUser(data.user);
        setServiceData(data.allServiceApts);
        setTechs(data.techs);

        return data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    }
    console.log("hit useeffect");
    fetchData();
  }, []);


  const formattedData = serviceData?.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end), // 45 minutes in milliseconds
  }));

  const [events, setEvents] = useState<Event[]>(formattedData);
  console.log(`\n-----formattedData`,`\n`,formattedData,`\n-----formattedData`)

  async function FetchAppts() {
    console.log("FetchAppts");
    const response = await axios.get(
      `${VITE_API_URL}/service/calendar/apts/get`,
      {
        withCredentials: true,
      }
    );
    const data = response.data.data;
    setServiceData(data.allServiceApts);
    /** const formattedData = data.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end), // 45 minutes in milliseconds
    }));

    //  setEvents(filteredEvents)

    filteredEvents =
      selectedResource === 0
        ? formattedData
        : formattedData.filter(
            (event) => event.resourceId === selectedResource
          ); */

    setIsSubmitting(false);
  }
  const onEventResize: withDragAndDropProps["onEventResize"] = (data) => {
    const { event, start, end } = data;

    setServiceData((prev) => {
      const existing = prev.find((ev) => ev?.id === event?.id) ?? {};
      const filtered = prev.filter((ev) => ev?.id !== event?.id);
      return [...filtered, { ...existing, start, end }];
    });
    setIsSubmitting(true);
    const payload = {
      start,
      end,
      intent: "dragAndDrop",
      userEmail: user.email,
      id: event.id,
    };

    try {
      const updateAPt = async () => {
        const response = await fetch(`${VITE_API_URL}/api/service/calendar/apt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          console.error("Failed to update event:", response.statusText);
        } else {
          console.log("Event updated successfully:", await response.json());
        }
      };
      updateAPt();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const onEventDrop: withDragAndDropProps["onEventDrop"] = (data) => {
    const { event, start, end } = data;

    setServiceData((prev) => {
      const existing = prev.find((ev) => ev?.id === event?.id) ?? {};
      const filtered = prev.filter((ev) => ev?.id !== event?.id);
      return [...filtered, { ...existing, start, end }];
    });
    setIsSubmitting(true);
    const payload = {
      start,
      end,
      userEmail: user?.email,
      id: event?.id,
      intent: "dragAndDrop",
    };

    try {
      const updateAPt = async () => {
        const response = await fetch(`${VITE_API_URL}/api/sales/calendar/apt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          console.error("Failed to update event:", response.statusText);
        } else {
          console.log("Event updated successfully:", await response.json());
        }
      };
      updateAPt();
    } catch (error) {
      console.error("Error moving event:", error);
    }
  };

  // min and max times
  const minTime = new Date();
  minTime.setHours(8, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(21, 30, 0);

  const [datePickerEventFormData, setDatePickerEventFormData] =
    useState<DatePickerEventFormData>(initialDatePickerEventFormData);
  const onAddEventFromDatePicker = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const addHours = (date: Date | undefined, hours: number) => {
      return date ? date.setHours(date.getHours() + hours) : undefined;
    };
    const setMinToZero = (date: Date | undefined) => {
      if (date) {
        date.setSeconds(0);
      }
      return date;
    };
    const data: IEventInfo = {
      ...datePickerEventFormData,
      _id: generateId(),
      start: setMinToZero(datePickerEventFormData.start),
      end: datePickerEventFormData.allDay
        ? addHours(datePickerEventFormData.start, 12)
        : setMinToZero(datePickerEventFormData.end),
    };
    const newEvents = [...formattedData, data];
    setServiceData(newEvents);
    setDatePickerEventFormData(initialDatePickerEventFormData);
  };
  // add event modal
  const [openSlot, setOpenSlot] = useState(false);
  const handleSelectSlot = (event: Event) => {
    setOpenSlot(true);
    setCurrentEvent(event);
  };
  const generateId = () => (Math.floor(Math.random() * 10000) + 1).toString();
  const handleClose = () => {
    setEventFormData(initialEventFormState);
    setOpenSlot(false);
  };
  const [eventFormData, setEventFormData] = useState<EventFormData>(
    initialEventFormState
  );
  const onAddEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const data: IEventInfo = {
      ...eventFormData,
      _id: generateId(),
      start: currentEvent?.start,
      end: currentEvent?.end,
      completed: currentEvent?.completed,
      apptType: currentEvent?.apptType,
      id: currentEvent?.id,
      contactMethod: currentEvent?.contactMethod,
      firstName: currentEvent?.firstName,
      lastName: currentEvent?.lastName,
    };

    const newEvents = [...formattedData, data];

    setServiceData(newEvents);
    handleClose();
  };
  const [currentEvent, setCurrentEvent] = useState<Event | IEventInfo | null>(
    null
  );
  // event info modal
  const [eventInfoModal, setEventInfoModal] = useState(false);
  const [selected, setSelected] = useState([]);



  async function FetchData(id) {
    const url = `${VITE_API_URL}/service/calendar/apt/get/${id}`;
    console.log(url, "url FetchData");
    try {
      const response = await axios.get(url, { withCredentials: true });
      const data = response.data.appt;
      console.log("fetch apt data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching FetchData from fetchdata function:", error);
      return null;
    }
  }

  async function HandleSelectEvent(event) {
    const data = await FetchData(event.id);
    console.log(event.id, data, "HandleSelectEvent from fetch");
    setSelected(event);
    setEventInfoModal(true);
  }
  async function HandleSelectEventCell(event) {
    const data = await FetchData(event.id);
    console.log(event.id, data, "HandleSelectEventCell from fetch");
    setSelected(event);

    setChangeToAppt(true);
  }

  const closeSelectEvent = useCallback(() => {
    setEventInfoModal(false);
  }, []);

  const onDeleteEvent = () => {
    setCurrentEvent(() =>
      [...formattedData].filter((e) => e._id !== (currentEvent as IEventInfo)._id!)
    );
    setEventInfoModal(false);
  };
  const onCompleteEvent = () => {
    setEventInfoModal(false);
  };

  // add customer modal
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [addApptModal, setAddApptModal] = useState(false);

  const toggleView = () => {
    setShowResources((prevState) => !prevState);
  };

  const handleResourceChange = (value) => {
    console.log("Selected Resource:", value);
    setSelectedResource(Number(value));
  };

  const [date, setDate] = useState<Date>();

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  const [hour, setHour] = useState(currentHour);
  const [min, setMin] = useState(currentMinute);
  const newDate = new Date();
  const onNavigate = useCallback((newDate) => setDate(newDate), [setDate]);


  const currentDate = new Date();

  useEffect(() => {
    if (isSubmitting) {
      setEventInfoModal((prev) => !prev);
      FetchAppts();
    }
  }, [isSubmitting]);

  let filteredEvents =
    Number(selectedResource) === 0
      ? formattedData
      : formattedData.filter(
          (event) => Number(event.resourceId) === Number(selectedResource)
        );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ---------------------------resource


   const resources = [
    { resourceId: "Service Desk", resourceTitle: "Service Desk" }, // Static entry
    ...techs.map((tech) => ({
      resourceId: tech.username,
      resourceTitle: tech.name,
    })),
    { resourceId: "Deliveries", resourceTitle: "Deliveries" }, // Static entry
  ];

  const colorMap = {};
  let colorIndex = 0;

  // Assign colors to users
  techs.forEach((user) => {
    if (!colorMap[user.username]) {
      colorMap[user.username] = colors[colorIndex % colors.length];
      colorIndex++;
    }
  });

  const userColorList = techs.map((user) => {
    const color = colorMap[user.username];
    return { username: user.username, color: color };
  });

  userColorList.forEach((item) => {
    console.log(`User: ${item.username}, Color: ${item.color}`);
  });
 
  // Custom function to style the active day
  const dayPropGetter = (date) => {
    const dayDate = new Date(date);
    dayDate.setHours(0, 0, 0, 0);

    if (dayDate.getTime() === today.getTime()) {
      return {
        style: {
          backgroundColor: '#282831', // Active day background
        },
      };
    }
    return {};
  };

  const getResourceId = (resource) => resource.resourceId;
  const getResourceTitle = (resource) => resource.resourceTitle;
 // 
  const LargeScreenUI = () => {
    return (
      <div className=" max-w-[100vw] w-full overflow-x-hidden max-h-[100vh] h-full overflow-y-hidden flex justify-start   bg-background ">
        <div className="flex justify-start border-t  border-border grow">
          <div className="flex justify-start h-screen w-[250px]">
            <div className="mt-3 flex-col justify-center bg-background mx-auto">
              <div className="grid grid-cols-1 mx-auto w-[250px] rounded-md border-white  text-foreground justify-center ">
                <div className="  my-3 flex justify-center   w-[250px]  ">
                  <CalendarIcon className="mr-2 size-8 " />
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span>{format(newDate, "PPP")}</span>
                  )}
                </div>
                <SmallCalendar
                  className="mx-auto w-auto   bg-background text-foreground"
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </div>
              <div className="mx-auto flex items-center justify-between  w-[180px] mb-3 ">
                <Button
                  variant="ghost"
                  className="cursor-pointer hover:text-primary justify-center items-center border-transparent hover:bg-transparent"
                  onClick={() =>
                    onNavigate(currentDate.setDate(currentDate.getDate() - 1))
                  }
                >
                  <ArrowLeft />
                </Button>
                <Button
                  variant="outline"
                  className=" text-center my-auto cursor-pointer hover:text-primary justify-center items-center border-border"
                  onClick={() => onNavigate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  className=" cursor-pointer hover:text-primary justify-center items-center border-transparent hover:bg-transparent"
                  onClick={() =>
                    onNavigate(currentDate.setDate(currentDate.getDate() + 1))
                  }
                >
                  <ArrowRight />
                </Button>
              </div>
              <ViewToolbar setView={setView} />
              <div className=" mt-3 grid grid-cols-1  justify-center mx-auto">
                <input type="hidden" value={String(date)} name="value" />
                <a
                  className="  mx-auto "
                  href={VITE_APP_URL + `/portal/service/dashboard`}
                >
                  <Button
                    variant="outline"
                    className="  w-[180px]   text-foreground cursor-pointer hover:text-primary justify-center items-center  mx-auto  border-border hover:border-primary bg-transparent hover:bg-transparent   "
                  >
                    <>
                      <Gauge size={20} strokeWidth={1.5} />
                      <p className="ml-2">Service Dashboard</p>
                    </>
                  </Button>
                </a>
              </div>
              <div className="flex-col justify-center">
                <ul className="ml-[90px] mt-4">
                  {userColorList.map((item, index) => (
                    <li key={index} className="mt-3  items-center">
                      <span
                        style={{
                          backgroundColor: item.color,
                          width: "16px",
                          height: "16px",
                          display: "inline-block",
                          marginRight: "8px",
                          borderRadius: "4px",
                        }}
                      ></span>
                      {item.username}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex max-w-[100%] max-h-[100%] h-full w-full justify-center overflow-x-auto overflow-y-auto">
            {showResources ? (
              <DnDCalendar
                step={30}
                dayLayoutAlgorithm="no-overlap"
                resources={resources}
                resourceIdAccessor={getResourceId}
                resourceTitleAccessor={resourceTitle}
                style={{
                  width: `calc(95vw - 275px)`,
                  height: "95vh",
                  overflowX: "hidden",
                  overflowY: "auto",
                  objectFit: "contain",
                  overscrollBehavior: "contain",
                  color: "#fafafa",
                  backgroundColor: "#09090b",
                }}
                selected={selected}
                defaultView={Views.WEEK}
                events={formattedData}
                localizer={localizer}
                min={minTime}
                max={maxTime}
                date={date}
                onNavigate={onNavigate}
                onView={onView}
                view={view}
                resizable
                components={{
                  toolbar: CustomToolbar,
                  event: HoverEvent,
                  agenda: {
                    event: HoverEvent,
                    time: AgendaTime,
                    date: AgendaDate,
                  },
                }}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                onSelectEvent={(e) => HandleSelectEvent(e)}
                onSelectSlot={HandleSelectEvent}
                dayPropGetter={dayPropGetter}
              />
            ) : (
              <DnDCalendar
                step={30}
                dayLayoutAlgorithm="no-overlap"
                resources={resources}
                resourceIdAccessor={getResourceId}
                resourceTitleAccessor={resourceTitle}
                style={{
                  width: `calc(95vw - 275px)`,
                  height: "95vh",
                  overflowX: "hidden",
                  overflowY: "scroll",
                  objectFit: "contain",
                  overscrollBehavior: "contain",
                  backgroundColor: "#09090b",
                  color: "#fafafa",
                }}
                selected={selected}
                defaultView={Views.DAY}
                events={formattedData}
                showMultiDayTimes={true}
                localizer={localizer}
                min={minTime}
                max={maxTime}
                date={date}
                onView={onView}
                view={view}
                onNavigate={onNavigate}
                components={{
                  toolbar: CustomToolbar,
                  event: HoverEvent,
                  agenda: {
                    event: HoverEvent,
                    time: AgendaTime,
                    date: AgendaDate,
                  },
                }}
                resizable
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                onSelectEvent={(e) => HandleSelectEvent(e)}
                onSelectSlot={HandleSelectEvent}
                dayPropGetter={dayPropGetter}
              />
            )}
          </div>
        </div>
        <EventInfoModal
          eventInfoModal={eventInfoModal}
          setEventInfoModal={setEventInfoModal}
          handleClose={() => closeSelectEvent()}
          onDeleteEvent={onDeleteEvent}
          selected={selected}
          user={user}
          onCompleteEvent={onCompleteEvent}
          setEvents={setServiceData}
          techs={techs}
        />
      </div>
    );
  };
  /**  <AddAppt
          open={addApptModal}
          handleClose={() => setAddApptModal(false)}
          onDeleteEvent={onDeleteEvent}
          currentEvent={currentEvent as IEventInfo}
          user={user}
          onCompleteEvent={onCompleteEvent}
        /> */

  // const scheduleFUPFetcher = useFetcher();
  // const completeApptFetcher = useFetcher();
  // const scheduleFUPSubmit = scheduleFUPFetcher.state === "submitting";
  // const completeApptSubmit = completeApptFetcher.state === "submitting";
  const [scheduleIsSubmitting, setScheduleIsSubmitting] = useState(false);
  const [completeIsSubmitting, setcompleteIsSubmitting] = useState(false);
  useEffect(() => {
    if (scheduleIsSubmitting) {
      setScheduleFUP(false);
      setChangeToAppt(false);
      setScheduleIsSubmitting(false);
    }
  }, [scheduleIsSubmitting]);

  useEffect(() => {
    if (completeIsSubmitting) {
      setChangeToAppt(false);
      setcompleteIsSubmitting(false);
    }
  }, [completeIsSubmitting]);

  const timerRef = useRef(0);
  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(""), 3000);
    });
  };
  const [copiedText, setCopiedText] = useState();
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const SmallScreenUI = () => {
    const ViewToolbar = ({ setView }) => {
      return (
        <div className="">
          <Select value={view} onValueChange={(value) => setView(value)}>
            <SelectTrigger className="w-[180px] mx-auto">
              <SelectValue placeholder="Select A Calendar View" />
            </SelectTrigger>
            <SelectContent className="border-border">
              <SelectGroup>
                <SelectLabel>Views</SelectLabel>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="agenda">Agenda</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      );
    };
    const options2 = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
    };
    const apt = [
      { name: "title", value: selected?.title, label: "Title" },
      {
        name: "start",
        value: String(
          new Date(selected?.start).toLocaleDateString("en-US", options2)
        ),
        label: "Start",
      },
      {
        name: "end",
        value: String(
          new Date(selected?.end).toLocaleDateString("en-US", options2)
        ),
        label: "End",
      },
      { name: "userName", value: selected?.userName, label: "Sales Person" },
    ];
    const client = [
      { name: "firstName", value: selected?.firstName, label: "First Name" },
      { name: "lastName", value: selected?.lastName, label: "Last Name" },
      { name: "phone", value: selected?.phone, label: "Phone" },
      { name: "email", value: selected?.email, label: "Email" },
      { name: "address", value: selected?.address, label: "Address" },
    ];
    const unit = [
      { name: "brand", value: selected?.brand, label: "Brand" },
      { name: "unit", value: selected?.unit, label: "Unit" },
    ];
    const textAreaInput = [
      {
        name: "description",
        value: selected?.description,
        label: "Description",
      },
    ];
    const [value, onChange] = useState<Value>(new Date());
    const [dateCC, setDateCC] = useState<Date>();
    const newDateCC = new Date();
    const [hour, setHour] = useState("09");
    const [min, setMin] = useState("00");
    return (
      <>
        <div
          className={`w-[${screenSize.width}px] overflow-hidden grid gris-cols-1 place-items-center mx-auto justify-center font-googleSans max-h-screen h-full `}
        >
          {changeToAppt ? (
            <>
              {/** top buttons */}
              <div className="flex justify-between items-center mt-3">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/portal/sales/customer/${selected?.clientfileId}/${selected?.financeId}`}
                >
                  <Button
                    size="sm"
                    //disabled={!selected?.clientfileId}
                    variant="outline"
                    className="bg-background ml-3"
                  >
                    Client File
                  </Button>
                </a>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto bg-background mr-1"
                  onClick={() => {
                    setChangeToAppt((prev) => !prev);
                    setScheduleFUP((prev) => !prev);
                  }}
                >
                  Cancel
                </Button>
              </div>
              {scheduleFUP ? (
                <UpdateCompeltedAppt
                  setScheduleIsSubmitting={setScheduleIsSubmitting}
                  dateCC={dateCC}
                  setDateCC={setDateCC}
                  newDateCC={newDateCC}
                  hour={hour}
                  setHour={setHour}
                  min={min}
                  setMin={setMin}
                  selected={selected}
                />
              ) : (
                <AppointmentInfo
                  apt={apt}
                  copyText={copyText}
                  copiedText={copiedText}
                  client={client}
                  unit={unit}
                  selected={selected}
                  textAreaInput={textAreaInput}
                  setcompleteIsSubmitting={setcompleteIsSubmitting}
                  setScheduleFUP={setScheduleFUP}
                />
              )}
            </>
          ) : (
            <div>
              <div className="mx-auto w-[300px] rounded-md border-white text-foreground ">
                <SmallCalendar
                  className="mx-auto w-auto bg-background text-foreground"
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
                <div className="mt-3 mx-auto flex items-center justify-between  w-[200px]">
                  <Button
                    variant="outline"
                    className="cursor-pointer  h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-muted-foreground"
                    onClick={() =>
                      onNavigate(currentDate.setDate(currentDate.getDate() - 1))
                    }
                  >
                    <ChevronLeftIcon className="h-4 w-4 text-foreground " />
                  </Button>
                  <Button
                    variant="ghost"
                    className=" text-center my-auto cursor-pointer hover:bg-transparent justify-center items-center border-border "
                    onClick={() => onNavigate(new Date())}
                  >
                    <div className="  my-3 flex justify-center  items-center text-muted-foreground  ">
                      <CalendarIcon className="mr-2 size-8 " />
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span>{format(newDate, "PPP")}</span>
                      )}
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="cursor-pointer  h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-muted-foreground"
                    onClick={() =>
                      onNavigate(currentDate.setDate(currentDate.getDate() + 1))
                    }
                  >
                    <ChevronRightIcon className="h-4 w-4  text-foreground" />
                  </Button>
                </div>
                <div className="mt-3 grid grid-cols-1 justify-center mx-auto">
                  <input type="hidden" value={String(date)} name="value" />

                  <ViewToolbar setView={setView} />
                  <div>
                    <Select
                      value={String(selectedResource)}
                      onValueChange={(value) => {
                        setSelectedResource(Number(value));
                        if (value === "0") {
                          setShowResources(true);
                        } else {
                          setShowResources(false);
                        }
                      }}
                    >
                      <SelectTrigger className=" w-[180px]  mx-auto mt-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectGroup>
                          <SelectLabel>Calendar Views</SelectLabel>
                          <SelectItem className="cursor-pointer" value="0">
                            All Calendar Views
                          </SelectItem>
                          <SelectItem className="cursor-pointer" value="1">
                            Sales Calls
                          </SelectItem>
                          <SelectItem className="cursor-pointer" value="2">
                            Sales Appointments
                          </SelectItem>
                          <SelectItem className="cursor-pointer" value="3">
                            Deliveries
                          </SelectItem>
                          <SelectItem className="cursor-pointer" value="4">
                            F & I
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <a
                    className="  mx-auto "
                    href={"/portal/leads/sales/dashboard"}
                  >
                    <Button
                      variant="outline"
                      className="  w-[180px]  mt-3 text-foreground cursor-pointer hover:text-primary justify-center items-center  mx-auto  border-border hover:border-primary bg-transparent hover:bg-transparent   "
                    >
                      <>
                        <Gauge size={20} strokeWidth={1.5} />
                        <p className="ml-2">Sales Dashboard</p>
                      </>
                    </Button>
                  </a>
                </div>
              </div>
              <div className="flex  justify-center mt-4 max-h-[55vh] h-full overflow-y-auto">
                {showResources ? (
                  <DnDCalendar
                    style={{
                      width: `${screenSize.width - 40}px`,
                      maxWidth: `${screenSize.width}px`,
                      height: "1000px",
                      maxHeight: "1000px",
                    }}
                    className="text-foreground overflow-y-auto overflow-x-hidden "
                    timeslots={4}
                    step={15}
                    showAllEvents={true}
                    dayLayoutAlgorithm={"no-overlap"}
                    //   resources={resourceMap}
                    resourceIdAccessor={getResourceId}
                    resourceTitleAccessor={resourceTitle}
                    selected={selected}
                    events={formattedData}
                    localizer={localizer}
                    defaultView={Views.DAY}
                    view={view}
                    onView={onView}
                    views={{
                      agenda: true,
                      day: true,
                      month: false,
                      week: false,
                    }}
                    min={minTime}
                    max={maxTime}
                    date={date}
                    onNavigate={onNavigate}
                    resizable
                    selectable
                    components={{
                      toolbar: CustomToolbar,
                      event: HoverEvent,
                      agenda: {
                        event: HoverEvent,
                        time: AgendaTime,
                        date: AgendaDate,
                      },
                    }}
                    onEventDrop={onEventDrop}
                    onEventResize={onEventResize}
                    onSelectEvent={HandleSelectEventCell}
                    /// onSelectSlot={HandleSelectEventCell}
                    //    eventPropGetter={eventPropGetter}
                  />
                ) : (
                  <DnDCalendar
                    style={{
                      width: `${screenSize.width - 40}px`,
                      maxWidth: `${screenSize.width}px`,
                      height: "1000px",
                      maxHeight: "1000px",
                    }}
                    className="text-foreground overflow-y-auto overflow-x-hidden "
                    timeslots={4}
                    step={15}
                    showAllEvents={true}
                    //  dayLayoutAlgorithm={'no-overlap'}
                    view={view}
                    defaultView={Views.DAY}
                    views={{
                      agenda: true,
                      day: true,
                      month: false,
                      week: false,
                    }}
                    selected={selected}
                    events={formattedData}
                    showMultiDayTimes={true}
                    localizer={localizer}
                    min={minTime}
                    max={maxTime}
                    date={date}
                    onNavigate={onNavigate}
                    components={{
                      toolbar: CustomToolbar,
                      event: HoverEvent,
                      agenda: {
                        event: HoverEvent,
                        time: AgendaTime,
                        date: AgendaDate,
                      },
                    }}
                    resizable
                    selectable
                    onEventDrop={onEventDrop}
                    onEventResize={onEventResize}
                    onSelectEvent={HandleSelectEventCell}
                    //  onSelectSlot={HandleSelectEventCell}
                    //   eventPropGetter={eventPropGetter}
                  />
                )}
              </div>
              <EventInfoModal
                open={eventInfoModal}
                setEventInfoModal={setEventInfoModal}
                handleClose={() => closeSelectEvent()}
                onDeleteEvent={onDeleteEvent}
                currentEvent={selected}
                user={user}
                onCompleteEvent={onCompleteEvent}
                setEvents={setServiceData}
                setScheduleIsSubmitting={setScheduleIsSubmitting}
                setcompleteIsSubmitting={setcompleteIsSubmitting}
              />
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="!overflow-hidden flex justify-start ">
      {isSmallScreen ? <SmallScreenUI /> : <LargeScreenUI />}
    </div>
  );
 };

const locales = {
  "en-US": enUS,
};
const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1);
const now = new Date();
const start = endOfHour(now);
const end = addHours(start, 2);
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
//@ts-ignore
const DnDCalendar = withDragAndDrop(Calendar);

export default Service;

const HoverEvent = ({ event }) => {
  const eventEnd = new Date(event?.start);
  const currentTime = new Date();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center cursor-pointer rounded-md w-full  my-auto hover:text-primary">
            {event?.completed === "no" && eventEnd < currentTime ? (
              <X color="#dc2626" strokeWidth={1.5} size={20} />
            ) : event?.completed === "yes" ? (
              <ClipboardCheck color="#00ad45" strokeWidth={1.5} size={20} />
            ) : event?.completed === "no" ? (
              <Clipboard strokeWidth={1.5} size={20} />
            ) : (
              ""
            )}
            <div className="grid grid-cols-1">
              <p className=" text-center my-auto capatilize ">
                {event?.WorkOrder?.Clientfile?.firstName}{" "}
                {event?.WorkOrder?.Clientfile?.lastName}{" "}
              </p>
              <p className=" text-left my-auto capatilize mt-3 ">
                {event?.title}
              </p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="grid grid-cols-1 bg-background border-border rounded-md p-3">
          <p>{event?.title} </p>
          <p>{event?.unit}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function EventInfoModal({
  event,
  selected,
  eventInfoModal,
  techs,
  setMyEvents,
  setEventInfoModal,
  setEvents,
  myEvents,
  closeSelectEvent,
}) {
  const data = selected;
  const tech = data && data.techEmail ? data.techEmail : "";
  const [technician, setTechnician] = useState(tech);
  const [newDate, setNewDate] = useState<Date>(new Date(data.start));

  const now = new Date(data.start);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const [hour, setHour] = useState(String(currentHour));
  const [min, setMin] = useState(String(currentMinute));

  const start = new Date(data.start);
  const end = new Date(data.end);
  const durationInHours = (end - start) / (1000 * 60 * 60);
  const options2 = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const aptData = [
    { name: "tech", value: data?.tech, label: "Tech" },
    { name: "resourceId", value: data?.resourceId, label: "Assigned Tech" },
    { name: "writer", value: data?.writer, label: "Service Writer" },
    { name: "workOrderId", value: data?.workOrderId, label: "Work Order Id" },
    {
      name: "start",
      value: new Date(data?.start).toLocaleDateString("en-US", options2),
      label: "Start",
    },
    { name: "length", value: durationInHours, label: "Service Length" },
    { name: "title", value: data?.title, label: "Title" },
    { name: "unit", value: data.unit, label: "Unit" },
    { name: "mileage", value: data?.mileage, label: "Mileage" },
    { name: "vin", value: data?.vin, label: "VIN" },
    { name: "tag", value: data?.tag, label: "Tag" },
    { name: "motor", value: data?.motor, label: "Motor" },
    { name: "color", value: data?.color, label: "Color" },
    { name: "location", value: data?.location, label: "Location" },
  ];
  const eventEnd = new Date(data?.start);
  const currentTime = new Date();

  const timerRef = useRef(0);
  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(""), 3000);
    });
  };
  const [copiedText, setCopiedText] = useState();
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  return (
    <>
      <Dialog open={eventInfoModal} onOpenChange={setEventInfoModal}>
        <DialogContent className="w-[95%] md:w-[525px] border-border rounded-[6px] max-h-[95vh] h-auto ">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center cursor-pointer rounded-md w-full  my-auto hover:text-primary">
                {data?.completed === "no" && eventEnd < currentTime ? (
                  <X color="#dc2626" strokeWidth={1.5} size={20} />
                ) : data?.completed === "yes" ? (
                  <ClipboardCheck color="#00ad45" strokeWidth={1.5} size={20} />
                ) : data?.completed === "no" ? (
                  <Clipboard strokeWidth={1.5} size={20} />
                ) : (
                  ""
                )}

                <p className=" text-center my-auto ">{selected?.title} </p>
              </div>
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Tabs defaultValue="Set Tech" className="w-[350px] mx-auto">
              <TabsList className="">
                <TabsTrigger value="Set Tech">Set Tech</TabsTrigger>
                <TabsTrigger value="Appointment Details">
                  Appointment Details
                </TabsTrigger>
                <TabsTrigger value="Edit Appointment">
                  Edit Appointment
                </TabsTrigger>
              </TabsList>
              <div className="overflow-y-auto">
                <TabsContent value="Set Tech">
                  <form
                    method="post"
                    onSubmit={async (e) => {
                      e.preventDefault();

                      const techName = techs.find(
                        (user) => user.email === technician
                      );

                      if (!techName) {
                        console.error("Technician not found");
                        return;
                      }

                      const formData = new FormData();
                      formData.append("aptId", data.id);
                      formData.append("workOrderId", String(data.workOrderId));
                      formData.append("techEmail", techName.email);
                      formData.append("intent", "updateTechnician");

                      try {
                        const response = await axios.post(
                          VITE_API_URL + "/service/calendar/workOrder/update",
                          formData
                        );

                        if (!response.ok) {
                          console.error(
                            "Failed to update technician:",
                            response.statusText
                          );
                          return;
                        }

                        // Optionally handle the server's response here
                        const result = await response.json();
                        console.log("Technician updated:", result);

                        setEventInfoModal((prev) => !prev);

                        setEvents((prevEvents) =>
                          prevEvents.map((e) =>
                            e.id === data.id
                              ? {
                                  ...e,
                                  techEmail: techName.email,
                                  tech: techName.username,
                                  resourceId: techName.username,
                                }
                              : e
                          )
                        );
                      } catch (error) {
                        console.error("Error updating technician:", error);
                      }
                    }}
                  >
                    <div className="relative mt-5">
                      <Select
                        defaultValue={tech}
                        name="tech"
                        onValueChange={(value) => {
                          setTechnician(value);
                        }}
                      >
                        <SelectTrigger className="w-full bg-background text-foreground border border-border">
                          <SelectValue defaultValue={tech} />
                        </SelectTrigger>
                        <SelectContent className="bg-background text-foreground border border-border">
                          <SelectGroup>
                            <SelectLabel>Technicians</SelectLabel>
                            {techs.map((user) => (
                              <SelectItem key={user.email} value={user.email}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">
                        Assigned Tech
                      </label>
                    </div>
                    <div className="mt-[25px] flex justify-end">
                      <Button
                        variant="outline"
                        type="submit"
                        className={`bg-background cursor-pointer ml-2 mr-2 p-3 hover:text-primary text-foreground font-bold uppercase text-xs rounded-md shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 `}
                      >
                        Update
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="Appointment Details">
                  <div className="grid grid-cols-1 w-[90%]  justify-center mx-auto">
                    {/** appt info */}
                    <ul className="grid gap-3 text-sm mt-3">
                      {aptData.map((item, index) => (
                        <li
                          key={index}
                          className=" group flex items-center justify-between"
                        >
                          <span className="text-muted-foreground">
                            {item.label}
                          </span>
                          <div className="flex">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => copyText(item.value)}
                              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                            >
                              <Copy className="h-3 w-3" />
                              <span className="sr-only">Copy</span>
                            </Button>
                            {copiedText === item.value && (
                              <Check
                                strokeWidth={1.5}
                                className=" ml-2 text-lg hover:text-[#00d354] text-[#00d354]"
                              />
                            )}
                            <span>{item.value} </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-[25px] flex justify-between">
                    <a href={`/dealer/service/workOrder/${data.workOrderId}`}>
                      <Button
                        className={` cursor-pointer ml-2 mr-2 p-3 hover:text-primary text-foreground font-bold uppercase text-xs rounded-md shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 `}
                      >
                        Work Order
                      </Button>
                    </a>

                    <a
                      href={`/dealer/service/technician/workOrder/${data.workOrderId}`}
                    >
                      <Button
                        className={` cursor-pointer ml-2 mr-2 p-3 hover:text-primary text-foreground font-bold uppercase text-xs rounded-md shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 `}
                      >
                        Tech Order
                      </Button>
                    </a>
                  </div>
                </TabsContent>

                <TabsContent value="Edit Appointment">
                  <div className="mx-auto justify-center">
                  <form
  method="post"
  onSubmit={async (e) => {
    e.preventDefault();

    const start = new Date(newDate);
    start.setHours(Number(hour), Number(min), 0, 0);

    const end = new Date(start);
    end.setHours(end.getHours() + durationInHours);

    const formData = new FormData();
    formData.append("aptId", data.id);
    formData.append("id", String(data.id));
    formData.append("start", String(start));
    formData.append("end", String(end));
    formData.append("intent", "updateAppt");

    try {
        const response = await axios.post(
            VITE_API_URL + "/service/calendar/workOrder/update",
            formData
          );

      if (!response.ok) {
        console.error("Failed to update appointment:", response.statusText);
        return;
      }

      // Optionally handle the server's response here
      const result = await response.json();
      console.log("Appointment updated:", result);

      setEventInfoModal((prev) => !prev);

      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === data.id
            ? {
                ...e,
                techEmail: data.techEmail,
                tech: data.tech,
                resourceId: data.tech,
                start: start,
                end: end,
              }
            : e
        )
      );
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  }}
>

                      <div className="  my-3 flex justify-center mx-auto  w-[275px]  ">
                        <CalendarIcon className="mr-2 size-8 " />
                        {newDate ? (
                          new Date(newDate).toLocaleDateString(
                            "en-US",
                            options2
                          )
                        ) : (
                          <span>
                            {new Date(newDate).toLocaleDateString(
                              "en-US",
                              options2
                            )}
                          </span>
                        )}
                      </div>

                      <SecondCalendar
                        className="bg-background text-foreground mx-auto"
                        mode="single"
                        selected={newDate}
                        onSelect={setNewDate}
                        initialFocus
                      />
                      <div className="flex items-center mx-auto justify-center">
                        <Select
                          name="pickHour"
                          value={hour}
                          onValueChange={setHour}
                        >
                          <SelectTrigger className="m-3 w-auto">
                            <SelectValue placeholder="hour" />
                          </SelectTrigger>
                          <SelectContent className="bg-background text-foreground border-border">
                            <SelectGroup>
                              <SelectLabel>Hour</SelectLabel>
                              <SelectItem value="09">9</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="11">11</SelectItem>
                              <SelectItem value="12">12</SelectItem>
                              <SelectItem value="13">13</SelectItem>
                              <SelectItem value="14">14</SelectItem>
                              <SelectItem value="15">15</SelectItem>
                              <SelectItem value="16">16</SelectItem>
                              <SelectItem value="17">17</SelectItem>
                              <SelectItem value="18">18</SelectItem>
                              <SelectItem value="19">19</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="21">21</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        <Select
                          name="pickMin"
                          value={min}
                          onValueChange={setMin}
                        >
                          <SelectTrigger className="m-3 w-auto">
                            <SelectValue placeholder="min" />
                          </SelectTrigger>
                          <SelectContent className="bg-background text-foreground border-border">
                            <SelectGroup>
                              <SelectLabel>Minute</SelectLabel>
                              <SelectItem value="00">00</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="30">30</SelectItem>
                              <SelectItem value="40">40</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="mt-[25px] flex justify-end">
                        <Button
                          variant="outline"
                          type="submit"
                          className={`bg-background cursor-pointer ml-2 mr-2 p-3 hover:text-primary text-foreground font-bold uppercase text-xs rounded-md shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 `}
                        >
                          Update
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
