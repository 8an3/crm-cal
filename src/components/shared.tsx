import {  Fragment,  useState,  useCallback,  useEffect,  useRef,  useMemo,  useDeferredValue,} from "react";
import { Calendar, Views, Navigate } from "react-big-calendar";import {  UserPlus,  Gauge,  CalendarPlus,  ChevronsLeft,  ChevronsRightLeft,  ChevronsRight,  ArrowLeft,  ArrowRight,  Sheet,  Truck,  Wrench,  CalendarIcon,  Copy,  Check,} from "lucide-react";
import clsx from "clsx";
import {  Button,  buttonVariants,  Popover,  PopoverTrigger,  PopoverContent,  Select,  SelectContent,  SelectGroup,  SelectItem,  SelectLabel,  SelectTrigger,  SelectValue,  Input,  Card,  Textarea,} from "./ui";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui";
import { Clipboard, ClipboardCheck, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar as RegCalendar } from "./ui/calendar";
import { Separator } from "./ui/separator";
import React from "react";
import axios from "axios";



const VITE_API_URL = import.meta.env.VITE_VITE_API_URL;

export const ViewToolbar = ({ setView }) => {
  return (
    <div className="">
      <Select
        //  value={view}
        onValueChange={(value) => setView(value)}
      >
        <SelectTrigger className="w-[180px] mx-auto">
          <SelectValue placeholder="Select A Calendar View" />
        </SelectTrigger>
        <SelectContent className="border-border">
          <SelectGroup>
            <SelectLabel>Views</SelectLabel>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="agenda">Agenda</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
export const ViewNamesGroup = ({
  views: viewNames,
  view,
  messages,
  onView,
}) => {
  return viewNames.map((name) => (
    <Button
      key={name}
      type="button"
      className={clsx({ "rbc-active": view === name })}
      onClick={() => onView(name)}
    >
      <p>{messages[name]}</p>
    </Button>
  ));
};
export const CustomToolbar = ({
  label,
  localizer: { messages },
  onNavigate,
  onView,
  view,
  views,
}) => {
  /** <div className="rbc-toolbar items-center">

      <span className="rbc-toolbar-label text-foreground text-center text-2xl my-auto">{ }</span>
      <span className="ml-auto justify-end mr-5">

      </span>
      <div className="ml-auto justify-end my-auto items-center">
        <Button
          variant='outline'
          className=' text-center my-auto  p-2 cursor-pointer hover:text-primary justify-center items-center border-border mr-4'
          onClick={() => onNavigate(new Date())}
        >
          Today
        </Button>
        <Button
          variant='ghost'
          className=' p-2 cursor-pointer hover:text-primary justify-center items-center border-transparent hover:bg-transparent'
          onClick={() => onNavigate(Navigate.PREVIOUS)}
        >
          <ArrowLeft />
        </Button>

        <Button
          variant='ghost'
          className='p-2 cursor-pointer hover:text-primary justify-center items-center mr-3 border-transparent hover:bg-transparent'
          onClick={() => onNavigate(Navigate.NEXT)}
        >
          <ArrowRight />
        </Button>
      </div>
    </div> */
  return null;
};
export const mobileToolbar = ({
  label,
  localizer: { messages },
  onNavigate,
  onView,
  view,
  views,
}) => {
  return (
    <div className="grid grid-cols-1">
      <span className="mx-auto">{label}</span>

      <span className="mx-auto">
        <button
          className="rounded-tl-md   rounded-bl-md   p-2 cursor-pointer hover:text-primary justify-center items-center "
          onClick={() => onNavigate(Navigate.PREVIOUS)}
        >
          <ChevronsLeft size={20} strokeWidth={1.5} />
        </button>
        <button
          className="rounded-none  p-2 cursor-pointer hover:text-primary justify-center items-center "
          onClick={() => onNavigate(Navigate.TODAY)}
        >
          Today
        </button>
        <button
          className=" rounded-tr-md  rounded-br-md  p-2 cursor-pointer hover:text-primary justify-center items-center mr-3"
          onClick={() => onNavigate(Navigate.NEXT)}
        >
          <ChevronsRight size={20} strokeWidth={1.5} />
        </button>
      </span>
    </div>
  );
};
export const noToolbar = ({
  label,
  localizer: { messages },
  onNavigate,
  onView,
  view,
  views,
}) => {
  return <div className="rbc-toolbar"></div>;
};
export const colors = [
  "#039be5",
  "#7986cb",
  "#f6bf26",
  "#9e69af",
  "#4285f4",
  "#33FFF3",
  "#ad1457",
  "#f09300",
  "#7cb342",
  "#1757aa",
  "#f4511e",
  "#0b8043",
  "#3f51b5",
  "#039be5",
  "#d81b60",
];
export interface IEventInfo extends Event {
  _id: string;
  id: string;
  todoId?: string;
  description: string;
  allDay: string;
  start: string;
  end: string;
  resourceId: number;
  userEmail: string;
  followUpDay1: string;
  financeId: string;
  direction: string;
  resultOfcall: string;
  firstName: string;
  lastName: string;
  email: string;
  brand: string;
  intent: string;
  contactMethod: string;
  completed: string;
  apptStatus: string;
  apptType: string;
  title: string;
  note: string;
  phone: string;
  resourceId2: string;
  address: string;
  userId: string;
  userName: string;
  messageTitle: string;
  attachments: string;
  getClientFileById: string;
  followUpDay: string;
  clientFileId: string;
  model: string;
  unit: string;

  writer: string;
  tech: string;
  vin: string;
  tag: string;
  motor: string;
  location: string;
  workOrderId: number;
  mileage: string;
  color: string;
}
export interface EventFormData {
  todoId: string;
  description: string;
  allDay: string;
  start: string;
  end: string;
  resourceId: string;
  userEmail: string;
  followUpDay1: string;
  financeId: string;
  direction: string;
  resultOfcall: string;
  firstName: string;
  lastName: string;
  email: string;
  brand: string;
  intent: string;
  contactMethod: string;
  completed: string;
  apptStatus: string;
  resourceId2: string;
  stockNum: string;
  apptType: string;
  unit: string;
  title: string;
  note: string;
  phone: string;
  address: string;
  userId: string;
  userName: string;
  messageTitle: string;
  attachments: string;
  getClientFileById: string;
  model: string;
  writer: string;
  tech: string;
  tag: string;
  motor: string;
  location: string;
  workOrderId: number;
  mileage: string;
  color: string;
}
export interface DatePickerEventFormData {
  allDay: boolean;
  start?: Date;
  end?: Date;
  todoId: string;
  description: string;
  resourceId: string;
  userEmail: string;
  followUpDay1: string;
  financeId: string;
  direction: string;
  resultOfcall: string;
  firstName: string;
  lastName: string;
  email: string;
  brand: string;
  intent: string;
  contactMethod: string;
  completed: string;
  apptStatus: string;
  apptType: string;
  title: string;
  note: string;
  phone: string;
  address: string;
  userId: string;
  userName: string;
  messageTitle: string;
  attachments: string;
  resourceId2: string;
  getClientFileById: string;
  model: string;
  unit: string;
  writer: string;
  tech: string;
  vin: string;
  tag: string;
  motor: string;
  location: string;
  workOrderId: number;
  mileage: string;
  color: string;
}
export const initialEventFormState: EventFormData = {
  description: "",
  todoId: undefined,
  completed: "no",
  apptType: "",
  getClientFileById: "",
  userEmail: "",
  followUpDay: "",
  clientFileId: "",
  brand: "",
  model: "",
  stockNum: "",
  writer: "",
  tech: "",
  vin: "",
  tag: "",
  motor: "",
  location: "",
  workOrderId: "",
  mileage: "",
  color: "",
};
export const initialDatePickerEventFormData: DatePickerEventFormData = {
  description: "",
  todoId: undefined,
  allDay: false,
  start: undefined,
  resourceId2: "",
  end: undefined,
  apptType: "",
  completed: "",
  resourceId: "",
  userEmail: "",
  followUpDay1: "",
  financeId: "",
  direction: "",
  resultOfcall: "",
  firstName: "",
  lastName: "",
  email: "",
  brand: "",
  intent: "",
  contactMethod: "",
  apptStatus: "",
  unit: "",
  title: "",
  note: "",
  phone: "",
  address: "",
  userId: "",
  userName: "",
  messageTitle: "",
  attachments: "",
  getClientFileById: "",
  followUpDay: "",
  clientFileId: "",
  model: "",
  writer: "",
  tech: "",
  vin: "",
  tag: "",
  motor: "",
  location: "",
  workOrderId: "",
  mileage: "",
  color: "",
};
export interface IProps {
  open: boolean;
  handleClose: Dispatch<SetStateAction<void>>;
  onDeleteEvent: (e: MouseEvent<HTMLButtonElement>) => void;
  onCompleteEvent: (e: MouseEvent<HTMLButtonElement>) => void;
  currentEvent: IEventInfo;
  user: IUser;
  techs: any;
}
export const useScreenSize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isSmallScreen;
};
export const resourceTitle = (resource) => {
  return (
    <div className="flex justify-center items-center  my-3">
      {resource.resourceTitle === "Service Desk" ? (
        <Sheet />
      ) : resource.resourceTitle === "Deliveries" ? (
        <Truck />
      ) : (
        <Wrench />
      )}
      <p className="text-foreground text-center text-3xl my-auto ml-3">
        {resource.resourceTitle}
      </p>
    </div>
  );
};
export const options2 = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  //hour12: false,
  timeZoneName: "short",
};
export const AgendaTime = ({ event, day, label }) => {
  const startTime = label.split("–")[0].trim();
  return <p className=" text-center text-foreground ">{startTime}</p>;
};
export const AgendaDate = ({ day, label }) => {
  const date = new Date(day);
  const dayDate = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
  const sheduledToday = new Date(day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });

  const isToday = sheduledToday === today;

  return (
    <div className="flex items-center  w-full  text-center mx-auto justify-center my-auto ">
      {isToday ? (
        <div className="rounded-full h-9 w-9 bg-[#4285f4] flex items-center justify-center">
          <p className="text-foreground text-xl">{dayDate}</p>
        </div>
      ) : (
        <p className="text-foreground text-xl">{dayDate}</p>
      )}
      <p className="text-muted-foreground ml-2">
        {month}, {dayOfWeek}
      </p>
    </div>
  );
};
export const HoverEvent = ({ event }) => {
  function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }
  const eventEnd = new Date(event.start);
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

            <p className=" text-center my-auto capatilize ">
             {event.firstName}{" "}
              {event.lastName}{" "}
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent className="grid grid-cols-1 bg-background border-border rounded-md p-3">
          <p>{event.title} </p>
          <p>
            {event.brand} {event.unit}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const descTemplateBeforeYes = [
  {
    value:
      "Need to talk to spouse, call back to see and deal with what they talked about",
  },
  { value: "Was busy last call, need to call again to go over sale" },
  {
    value:
      "Follow up, ask for objections or anything else that would stop them from moving forward",
  },
  {
    value: "Was close to getting a yes last call, need to get in touch again",
  },
  {
    value:
      "Sent email / text, did not get a immediate response need to folow up",
  },
  { value: "Came in person, send finance / deal figures" },
];
export const descTemplateAfterYes = [
  {
    value: "Ask for deposit",
  },
  { value: "Need to schedule apt for customer to bring in trade" },
  { value: "Need to resend bos / paperwork" },
  {
    value: "Need to confirm parts list",
  },
  {
    value: "Need to secure payment for requested accessories",
  },
  { value: "Schedule delivery" },
  { value: "Schedule finance application" },
  { value: "Bring deal to sales manager to try to work it" },
  {
    value: "Follow up with other depts to ensure everything is ready for PU",
  },
  { value: "Need to reschedule PU, call customer and inform of the issue" },
  { value: "Need" },
  { value: "N A" },
];
export function DescriptionTemplate({ defaultValue }) {
  // <DescriptionTemplate  defaultValue={rowData.descriptionTemplate} />
  return (
    <div className="relative mt-5">
      <Select name="descriptionTemplate" defaultValue={defaultValue}>
        <SelectTrigger className="focus:border-primary">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background text-foreground">
          <SelectGroup>
            <SelectLabel className="text-muted-foreground">
              Before receiving a yes
            </SelectLabel>
            {descTemplateBeforeYes.map((item, index) => (
              <SelectItem
                className="cursor-pointer hover:bg-[#27272a]"
                key={index}
                value={item.value}
              >
                {item.value}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel className="text-muted-foreground">
              After receiving a yes
            </SelectLabel>
            {descTemplateAfterYes.map((item, index) => (
              <SelectItem
                className="cursor-pointer hover:bg-[#27272a]"
                key={index}
                value={item.value}
              >
                {item.value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
        Description Templates
      </label>
    </div>
  );
}
export const Basic = [
  { value: "Reached" },
  { value: "Left Message" },
  { value: "Completed" },
  { value: "Rescheduled" },
];
export const CallResultMovingForward = [
  { value: "Wants to move forward, got deposit" },
  { value: "Wants to move forward, did not have credit card on him" },
  { value: "Wants to get approval before moving forward" },
  { value: "Sent BOS to sign off on deal" },
  { value: "Wants to come back in to view and negotiate" },
];
export const CallResulSaleIdle = [
  { value: "Talked to wife, husband was not home" },
  { value: "Got a hold of the client, was busy need to call back" },
  { value: "Gave pricing, need to follow up" },
  { value: "Needs to discuss with spouse" },
  { value: "No Answer / Left Message" },
];
export const CallResulNo = [
  {
    value:
      "Does not want to move forward right now wants me to call in the future",
  },
  { value: "Bought else where" },
  { value: "Does not want to move forward, set to lost" },
];
export function UpdatingResult({ defaultValue }) {
  // <UpdatingResult name="note" defaultValue={note ? String(note) : ""} />
  return (
    <div className="relative mt-5">
      <Select name="resultOfcallTemplate" defaultValue={defaultValue}>
        <SelectTrigger className="focus:border-primary">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background text-foreground">
          <SelectGroup>
            {Basic.map((item, index) => (
              <SelectItem key={index} value={item.value}>
                {item.value}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel className="text-muted-foreground">
              Moving Forward
            </SelectLabel>
            {CallResultMovingForward.map((item, index) => (
              <SelectItem key={index} value={item.value}>
                {item.value}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel className="text-muted-foreground">
              Sale Idle
            </SelectLabel>
            {CallResulSaleIdle.map((item, index) => (
              <SelectItem key={index} value={item.value}>
                {item.value}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel className="text-muted-foreground">
              Not Moving Forward
            </SelectLabel>
            {CallResulNo.map((item, index) => (
              <SelectItem key={index} value={item.value}>
                {item.value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
        Description Templates
      </label>
    </div>
  );
}
export function UpdateCompeltedAppt({
  scheduleFUPFetcher,
  dateCC,
  setDateCC,
  newDateCC,
  hour,
  setHour,
  min,
  setMin,
  selected,
}) {
  return (
    <div className="max-h-[95vh] w-full h-auto overflow-y-auto overflow-x-hidden  mx-auto justify-center ">
      {/** Updating Completed Appointment */}
      <form method="post">
        <p className="text-center text-muted-foreground">
          Updating Completed Appointment
        </p>
        <Separator className="mb-3 w-[90%] border-border text-border bg-border mx-auto" />
        <div className="grid grid-cols-1 mx-auto w-[90%] mt-3">
          {/** resultOfcallUpdate */}
          <div className="relative mt-5">
            <Select name="resultOfcallUpdate" defaultValue="Attempted">
              <SelectTrigger className="w-full mx-auto  focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="Reached">Reached</SelectItem>
                <SelectItem value="Attempted">Left Message</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-muted-foreground">
              Result of call
            </label>
          </div>
          {/** noteUpdate */}
          <UpdatingResult defaultValue={"No Answer / Left Message"} />
          {/** completeUpdate */}
          {/** descriptionUpdate */}
          <div className="relative mt-5">
            <Textarea name="descriptionUpdate" className="w-full" />
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-muted-foreground">
              Description
            </label>
          </div>
          <p className="text-center mt-5 text-muted-foreground">
            Creating New Appointment
          </p>
          <Separator className="mb-3 w-[90%] border-border text-border bg-border mx-auto" />

          {/** calendar */}
          <div className="  my-3 flex justify-center mx-auto  w-full items-center  ">
            <CalendarIcon className="mr-2 size-8 " />
            {dateCC ? (
              format(dateCC, "PPP")
            ) : (
              <span>{format(newDateCC, "PPP")}</span>
            )}
          </div>
          <RegCalendar
            className="bg-background text-foreground mx-auto"
            mode="single"
            selected={dateCC}
            onSelect={setDateCC}
            initialFocus
          />
          <input type="hidden" value={String(dateCC)} name="pickedDate" />
          {/** hour min */}
          <div className="flex items-center mx-auto">
            <Select name="hour" value={hour} onValueChange={setHour}>
              <SelectTrigger className="m-3 w-auto">
                <SelectValue placeholder="hour" />
              </SelectTrigger>
              <SelectContent className="bg-background text-foreground border-border">
                <SelectGroup>
                  <SelectLabel>Hour</SelectLabel>
                  <SelectItem value="09">09</SelectItem>
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

            <Select name="min" value={min} onValueChange={setMin}>
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
          <input type="hidden" value={String(dateCC)} name="value" />
          {/** title */}
          <div className="relative mt-5">
            <Input
              type="text"
              name="title"
              defaultValue={selected?.title}
              className="bg-background focus:border-primary w-full mx-auto "
            />
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-muted-foreground">
              Title
            </label>
          </div>
          {/** contactMethod */}
          <div className="relative mt-5">
            <Select name="contactMethod" defaultValue="Email">
              <SelectTrigger className="w-full mx-auto  focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="Phone">Phone</SelectItem>
                <SelectItem value="InPerson">In-Person</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
              </SelectContent>
            </Select>
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-muted-foreground">
              Contact Method
            </label>
          </div>
          {/** resourceId */}
          <div className="relative mt-5">
            <Select name="resourceId" defaultValue="1">
              <SelectTrigger className="w-full mx-auto  focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="1">Sales Calls</SelectItem>
                <SelectItem value="2">Sales Appointments</SelectItem>
                <SelectItem value="3">Deliveries</SelectItem>
                <SelectItem value="4">F & I Appointments</SelectItem>
              </SelectContent>
            </Select>
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-muted-foreground">
              Type of Appointment
            </label>
          </div>
          <DescriptionTemplate defaultValue="Follow up, ask for objections or anything else that would stop them from moving forward" />
          {/** description */}
          <div className="relative mt-5">
            <Textarea name="description" className="w-full" />
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-muted-foreground">
              Description
            </label>
          </div>
        </div>

        <input
          type="hidden"
          defaultValue={selected?.financeId}
          name="financeId"
        />
        <input type="hidden" defaultValue={selected?.brand} name="brand" />
        <input type="hidden" defaultValue={selected?.unit} name="unit" />

        <input type="hidden" defaultValue={selected?.phone} name="phone" />
        <input type="hidden" name="email" value={selected?.email} />
        <input
          type="hidden"
          defaultValue={selected?.lastName}
          name="lastName"
        />
        <input
          type="hidden"
          defaultValue={selected?.firstName}
          name="firstName"
        />
        <input type="hidden" defaultValue={selected?.address} name="address" />

        <input type="hidden" defaultValue={selected?.id} name="aptId" />
        <input type="hidden" value="Pending" name="resultOfcall" />
        <Input type="hidden" defaultValue="Upcoming Apt" name="apptStatus" />
        <Input type="hidden" defaultValue="no" name="completed" />
        {/** button */}
        <div className="mt-[25px] flex justify-end">
          <Button
            disabled={!dateCC}
            name="intent"
            value="scheduleFUp"
            type="submit"
            className={` cursor-pointer ml-2 mr-2 p-3 hover:text-primary text-foreground font-bold uppercase text-xs rounded-md shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 `}
          >
            Complete & Create Follow-up
          </Button>
        </div>
      </form>
    </div>
  );
}
export function AppointmentInfo({
  apt,
  copyText,
  copiedText,
  client,
  unit,
  selected,
  textAreaInput,
  completeApptFetcher,
  setScheduleFUP,
  VITE_API_URL,
}) {
  const handleSubmit = useCallback(() => {
    const form = new FormData();
    form.append("aptId", selected?.id);
    form.append("intent", "compeleteApptOnly");
    axios.post(VITE_API_URL + "/sales/calendar/apt", form);
  }, [selected?.id, completeApptFetcher]);

  const handleFollowUp = useCallback(() => {
    setScheduleFUP(true);
  }, [setScheduleFUP]);

  return (
    <div className="max-h-[95vh] w-full h-auto overflow-y-auto overflow-x-hidden  mx-auto justify-center ">
      {/** Appointment into */}

      <p className="text-lg text-center  text-muted-foreground">
        Appointment Details
      </p>
      <Separator className="border-border text-border bg-border w-[90%] mx-auto" />
      <form
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 w-[90%]  justify-center mx-auto">
          {/** appt info */}
          <ul className="grid gap-3 text-sm mt-3">
            {apt.map((item, index) => (
              <li
                key={index}
                className=" group flex items-center justify-between"
              >
                <span className="text-muted-foreground">{item.label}</span>
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
          <p className="text-lg text-center    mt-5 text-muted-foreground">
            Client Information
          </p>
          <Separator className="border-border text-border bg-border w-[90%] mx-auto" />
          {/** client info */}
          <ul className="grid gap-3 text-sm mt-2">
            {client.map((item, index) => (
              <li
                key={index}
                className=" group flex items-center justify-between"
              >
                <span className="text-muted-foreground">{item.label}</span>

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
          <p className="text-lg text-center text-muted-foreground mt-5">
            Unit Description
          </p>
          <Separator className="border-border text-border bg-border w-[90%] mx-auto" />
          {/** unit info */}
          <ul className="grid gap-3 text-sm mt-2">
            {unit.map((item, index) => (
              <li
                key={index}
                className=" group flex items-center justify-between"
              >
                <span className="text-muted-foreground">{item.label}</span>
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
          {/** contactMethod */}
          <div className="relative mt-8">
            <Select name="contactMethod" defaultValue="Email">
              <SelectTrigger className="w-full  focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="Phone">Phone</SelectItem>
                <SelectItem value="InPerson">In-Person</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
              </SelectContent>
            </Select>
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-muted-foreground">
              Contact Method
            </label>
          </div>
          {/** resultOfcall */}
          <div className="relative mt-5 ">
            <Select
              name="resultOfcall"
              defaultValue={
                selected?.completed === "yes"
                  ? "Completed"
                  : selected?.resultOfcall
                  ? selected?.resultOfcall
                  : "Pending"
              }
            >
              <SelectTrigger className="w-full  focus:border-primary text-right">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectGroup>
                  <SelectLabel>Result of call</SelectLabel>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Reached">Reached</SelectItem>
                  <SelectItem value="Attempted">N/A</SelectItem>
                  <SelectItem value="Left Message">Left Message</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground  text-muted-foreground">
              Result of call
            </label>
          </div>
          {/** resourceId */}
          <div className="relative mt-5">
            <Select
              name="resourceId"
              defaultValue={String(selected?.resourceId)}
            >
              <SelectTrigger className="w-full focus:border-primary  ">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="1">Sales Calls</SelectItem>
                <SelectItem value="2">Sales Appointments</SelectItem>
                <SelectItem value="3">Deliveries</SelectItem>
                <SelectItem value="4">F & I Appointments</SelectItem>
              </SelectContent>
            </Select>
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground  text-muted-foreground">
              Appointment Type
            </label>
          </div>
          {/** apptStatus */}
          <div className="relative mt-5 ">
            <Select
              name="apptStatus"
              value={
                selected?.completed === "yes"
                  ? "Completed"
                  : selected?.apptStatus || "Upcoming Apt"
              }
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <SelectTrigger className="w-full focus:border-primary text-right">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="Upcoming Apt">Upcoming Apt</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Future">Showed</SelectItem>
                <SelectItem value="No Show">No Show</SelectItem>
                <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-muted-foreground">
              Appointment Status
            </label>
          </div>
          {/** note */}
          <UpdatingResult defaultValue="No Answer / Left Message" />
          {/** description */}
          {textAreaInput.map((item, index) => (
            <div key={index} className="relative mt-5">
              <Textarea
                name={item.name}
                defaultValue={item.value}
                className="w-full"
              />
              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-muted-foreground">
                {item.label}
              </label>
            </div>
          ))}
        </div>
        <input type="hidden" defaultValue={selected?.id} name="aptId" />
        {/** Update Appt button */}
        <div className="flex justify-between items-center mt-5">
          <Button
            variant="outline"
            className="bg-background "
            type="submit"
            name="intent"
            size="sm"
            value="updateAppt"
          >
            Update Appt
          </Button>
        </div>
      </form>
      {/** Complete & Complete Appt & Schedule Follow-up button */}
      <div className="flex justify-between items-center mt-5">
        <Button onClick={handleFollowUp} variant="outline" size="sm">
          Complete Appt
        </Button>
        <Button onClick={handleFollowUp} variant="outline" size="sm">
          Complete Appt & Schedule Follow-up
        </Button>
      </div>
    </div>
  );
}
