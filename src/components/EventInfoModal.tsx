import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui";

import { Button } from "./ui";
import React, {
  type SetStateAction,
  type MouseEvent,
  type Dispatch,
  useState,
  useRef,
  useEffect,
} from "react";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "../styles/rbc.css";
import { Clipboard, ClipboardCheck, Copy, X } from "lucide-react";
import { AppointmentInfo, UpdateCompeltedAppt } from "./shared";

export default function EventInfoModal({
  user,
  setEventInfoModal,
  eventInfoModal,
  handleClose,
  selected,
  setEvents,
  setScheduleIsSubmitting,
  setcompleteIsSubmitting,
}) {
  const options2 = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    //  hour12: true,
  };
  console.log(selected, "selected eventinfomodal");

  const apt = [
    { name: "title", value: selected?.title, label: "Title" },
    {
      name: "start",
      value: String(
        new Date(selected?.start).toLocaleDateString("en-US", options2)
      ),
      label: "Start Time",
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
    { name: "description", value: selected?.description, label: "Description" },
  ];

  const timerRef = React.useRef(0);
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

  // complete call //   // complete call //   // complete call //
  const [changeToAppt, setChangeToAppt] = useState(false);
  const [scheduleFUP, setScheduleFUP] = useState(false);
  const [value, onChange] = useState<Value>(new Date());
  const [dateCC, setDateCC] = useState<Date>();
  const newDateCC = new Date();
  const [hour, setHour] = useState("09");
  const [min, setMin] = useState("00");
  const event = selected;
  const eventEnd = new Date(selected?.start);
  const nowTime = new Date();
 
  return (
    <>
      <Dialog open={eventInfoModal} onOpenChange={setEventInfoModal}>
        <DialogContent className="w-[95%] md:w-[525px] border-border rounded-[6px] max-h-[95vh] h-auto overflow-y-clip">
          <DialogHeader>
            <DialogTitle>
              <div className="flex justify-between items-center mt-5">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/portal/sales/customer/${selected?.clientfileId}/${selected?.financeId}`}
                >
                  <Button
                    size="sm"
                    disabled={!selected?.clientfileId && !selected?.financeId}
                    variant="outline"
                    className="bg-background"
                  >
                    Client File
                  </Button>
                </a>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto bg-background "
                  disabled={scheduleFUP === false}
                  onClick={() => {
                    setChangeToAppt((prev) => !prev);
                    setScheduleFUP((prev) => !prev);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              <div className="flex items-center cursor-pointer mt-5 justify-center text-lg text-center">
                {event?.completed === "no" && eventEnd < nowTime ? (
                  <X color="#dc2626" strokeWidth={1.5} size={20} />
                ) : event?.completed === "yes" ? (
                  <ClipboardCheck color="#00ad45" strokeWidth={1.5} size={20} />
                ) : event?.completed === "no" ? (
                  <Clipboard strokeWidth={1.5} size={20} />
                ) : (
                  ""
                )}{" "}
                {selected?.firstName} {selected?.lastName}
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="">
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
                setEvents={setEvents}
              />
            ) : (
              <AppointmentInfo
                setEvents={setEvents}
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface IProps {
  open: boolean;
  handleClose: Dispatch<SetStateAction<void>>;
  onDeleteEvent: (e: MouseEvent<HTMLButtonElement>) => void;
  onCompleteEvent: (e: MouseEvent<HTMLButtonElement>) => void;
  currentEvent: IEventInfo;
  user: IUser;
  fetcher: any;
  setEventInfoModal: any;
}
interface IUser {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  contactMethod: string;
  start: string;
  completed: string;
  model: string;
  userEmail: string;
  unit: string;
  year: string;
  apptType: string;
  brand: string;
  note: string;
  userId: string;
  apptStatus: string;
  userName: string;
  customerState: string;
  resourceId: string;
  financeId: string;
  end: string;
  description: string;
  title: string;
  direction: string;
  resultOfcall: string;
  // Add other properties as needed
}
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
