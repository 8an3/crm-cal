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
  ChevronsRightLeft,
} from "lucide-react";
import EventInfoModal from "../components/EventInfoModal";
import AddCustomerModal from "../components/addCustomerModal";
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
  EventFormData,
  DatePickerEventFormData,
  initialEventFormState,
  initialDatePickerEventFormData,
  IProps,
  HoverEvent,
  AgendaTime,
  AgendaDate,
  AppointmentInfo,
  UpdateCompeltedAppt,
} from "../components/shared";
import { Calendar as SmallCalendar } from "../components/ui/calendar";
import "../styles/calendarMargin.css";
import "../styles/rbc.css";
import axios from "axios";
import React from "react";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import "../styles/sonner.css";


const VITE_API_URL = import.meta.env.VITE_VITE_API_URL;
const VITE_APP_URL = import.meta.env.VITE_APP_URL;

export default function EmployeeUserSchedule  ()  {
  useEffect(() => {
    document.title = "Employee Schedule - DSA";
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState();
  const [data, setData] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(); // true
  const [selectedResource, setSelectedResource] = useState(1); // 1
  const [view, setView] = useState();
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const onView = useCallback((newView) => setView(newView), [setView]);
  const [userNumberMapping, setUserNumberMapping] = useState([]);
  const [salesSched, setSalesSched] = useState([]);
  const [users, setUsers] = useState();
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const { salespersonEmail } = useParams();

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
        const response = await axios.get(`${VITE_API_URL}/admin/employee/${salespersonEmail}`, {
          withCredentials: true,
        });
        console.log("hit axios", response);
        const data = response.data;
        setData(data.events);
        return data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    }
    console.log("hit useeffect");
    fetchData();
  }, []);

  const formattedData = data?.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  const [events, setEvents] = useState(formattedData);



  const [draggedEvent, setDraggedEvent] = useState()
  const [displayDragItemInCell, setDisplayDragItemInCell] = useState(true)
  const [counters, setCounters] = useState({ item1: 0, item2: 0 })

  const eventPropGetter = useCallback(
    (event) => ({
      ...(event.isDraggable
        ? { className: 'isDraggable' }
        : { className: 'nonDraggable' }),
    }),
    []
  )
  const handleDragStart = useCallback((event) => setDraggedEvent(event), [])

  // min and max times
  const minTime = new Date();
  minTime.setHours(8, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(21, 30, 0);



  // event info modal
  const [eventInfoModal, setEventInfoModal] = useState(false);
  const [selected, setSelected] = useState([]);

  const [showResources, setShowResources] = useState(true);

  const toggleView = () => {
    setShowResources(prevState => !prevState);
  };


  userNumberMapping.sort((a, b) => a.generatedTwoDigitNumber - b.generatedTwoDigitNumber);
  const resourceMap = userNumberMapping.map(user => ({
    resourceId: user.resourceId,
    title: user.title,
    salespersonEmail: user.salespersonEmail,
    userId: user.id,
    day: user.day,
    id: user.id,
    userEmail: user.userEmail,
    userName: user.userName,
    name: user.name,
  }));

  const ViewNamesGroup = ({ views: viewNames, view, messages, onView }) => {
    return viewNames.map((name) => (
      <Button
        key={name}
        type="button"
        className={clsx({ 'rbc-active': view === name })}
        onClick={() => onView(name)}
      >
        <p>{messages[name]}</p>
      </Button>
    ))
  }

  const CustomToolbar = ({
    label,
    localizer: { messages },
    onNavigate,
    onView,
    view,
    views,
  }) => {
    return (
      <div className="rbc-toolbar">
        <span className="rbc-toolbar-label">{label}</span>
      </div>
    )
  }

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  return (
    <div className="!overflow-hidden flex justify-start ">
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
              <div className="mx-auto flex items-center justify-between  w-[180px]">
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

              <div className=" mt-3 grid grid-cols-1  justify-center mx-auto">
                <input type="hidden" value={String(date)} name="value" />
              </div>
            </div>
          </div>
          <div className="flex max-w-[100%] max-h-[100%] h-full w-full justify-center overflow-x-auto overflow-y-auto">
            {showResources ? (
              <DnDCalendar
                step={30}
                dayLayoutAlgorithm="no-overlap"
                style={{
                  width: `calc(95vw - 275px)`,
                  height: "95vh",
                  overflowX: "hidden",
                  overflowY: "auto",
                  objectFit: "contain",
                  overscrollBehavior: "contain",
                  color: "#fafafa",
                  backgroundColor: '#09090b',
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
                selectable
                dayPropGetter={dayPropGetter}
                draggableAccessor="isDraggable"
                eventPropGetter={eventPropGetter}
                components={{ toolbar: CustomToolbar, }}
              />
            ) : (
              <DnDCalendar
                step={30}
                dayLayoutAlgorithm="no-overlap"
                style={{
                  width: `calc(95vw - 275px)`,
                  height: "95vh",
                  overflowX: "hidden",
                  overflowY: "scroll",
                  objectFit: "contain",
                  overscrollBehavior: "contain",
                  backgroundColor: '#09090b',
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
                resizable
                selectable

                dayPropGetter={dayPropGetter}
                eventPropGetter={eventPropGetter}
                components={{ toolbar: CustomToolbar, }}

                resourceIdAccessor="resourceId"
                resources={resourceMap}
                resourceTitleAccessor="resourceTitle"


              />
            )}
          </div>
        </div>
      </div>
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

 

function getCurrentWeekDates() {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Set to Sunday of the current week
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() - today.getDay() + 6); // Set to Saturday of the current week
  return { startOfWeek, endOfWeek };
}

