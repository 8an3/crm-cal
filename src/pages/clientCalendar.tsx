import { Calendar, dateFnsLocalizer, Event, Views, } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import addHours from 'date-fns/addHours'
import startOfHour from 'date-fns/startOfHour'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useCallback, useEffect, useState, useRef } from 'react'
import { ArrowLeft, ArrowDownToDot, ArrowRight, CalendarIcon, Search, } from "lucide-react";
import { Button, buttonVariants, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Popover, PopoverTrigger, PopoverContent, Input, Separator, Label, Textarea, } from "../components/ui";
import { useScreenSize, ViewNamesGroup, CustomToolbar, mobileToolbar, noToolbar, colors, IEventInfo, EventFormData, DatePickerEventFormData, initialEventFormState, initialDatePickerEventFormData, IProps, ViewToolbar, AgendaTime, AgendaDate, AppointmentInfo, UpdateCompeltedAppt, } from "../components/shared";
import { Calendar as SmallCalendar } from "../components/ui/calendar";
import "../styles/sonner.css";
import "../styles/calendarMargin.css";
import "../styles/rbc.css";
import axios from "axios";
import { useParams } from 'react-router-dom'
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut, } from "../components/ui/command"
import { toast } from 'sonner'



export default function ClientSetter() {
    const [events, setEvents] = useState<Event[]>([{ title: 'Learn cool stuff', start, end, },])
    const searchRef = useRef();
    const [user, setUser] = useState();
    const [open, setOpen] = useState(false)
    const [note, setNote] = useState('');
    const [description, setDescription] = useState('');
    const [brandId, setBrandId] = useState("");
    const [modelList, setModelList] = useState();
    const [date, setDate] = useState<Date>();
    const newDate = new Date();
    const onNavigate = useCallback((newDate) => setDate(newDate), [setDate]);
    const [view, setView] = useState();
    const onView = useCallback((newView) => setView(newView), [setView]);
    const [clientApt, setClientApt] = useState()
    const [userSearch, setUserSearch] = useState()
    const [search, setSearch] = useState()
    const [model, setModel] = useState()
    const { salespersonEmail } = useParams();
    const userEmail = 'skylerzanth@outlook.com' //salespersonEmail
    const [salesData, setSalesData] = useState([]);
    const [clientName, setClientName] = useState()
    const [finalizeAppt, setFinalizeAppt] = useState(false)
    const [completed, setCompleted] = useState(false)


    useEffect(() => {
        if (userEmail === undefined) {
            setOpen(true)
        } else if (userEmail !== undefined) {
            async function fetchData(email) {
                try {
                    const result = await axios.get(`${VITE_API_URL}/sales/calendar/clientsetter/${email}`)
                    const data = result.data.data;
                    setSalesData(data.appts);
                    setUser(data.user);
                    const d = data.salesData?.map((event) => ({ ...event, start: new Date(event.start), end: new Date(event.end), isDraggable: false }));
                    setEvents(d);
                    setOpen(false);
                    return data;
                } catch (error) {
                    console.error("Error fetching all data:", error);
                    return null;
                }
            }
            setOpen(false)
            const fetchy = fetchData(userEmail);
            console.log(fetchy, 'fetchData');
        }
    }, []);
    useEffect(() => {
        if (user && user?.email) {
            setOpen(false)
        }
    }, [user]);
    const d = salesData?.map((event) => ({ ...event, start: new Date(event.start), end: new Date(event.end), isDraggable: false }));

    const saveApt = async () => {
        if (clientApt?.clientfileId && clientApt?.financeId) {
            try {
                const response = await axios.post(`${VITE_API_URL}/sales/calendar/clientsetter/save`, {
                    financeId: clientApt.financeId,
                    clientfileId: clientApt.clientfileId,
                    unit: clientApt.unit,
                    brand: clientApt.brand,
                    firstName: clientApt.firstName,
                    lastName: clientApt.lastName,
                    email: clientApt.email,
                    phone: clientApt.phone,
                    address: clientApt.address,
                    note: clientApt.note,
                    description: clientApt.description,
                    start: clientApt.start.toISOString(),
                    end: clientApt.end.toISOString(),
                    intent: "dragAndDrop",
                    id: clientApt.id,
                    userEmail: user ? user?.email : '',
                }, { headers: { 'Content-Type': 'multipart/form-data' } }
                )
                setSalesData((prev) => {
                    const eventId = '666'
                    const filtered = prev.filter((ev) => ev?.id !== eventId);
                    return [...filtered, { ...response.data.create }];
                });
                setClientApt(null)
                console.log(response, salesData, 'response')
                toast.success("Success", { description: "Your date is locked in! We will see you soon.", duration: 10000 });
            } catch (error) {
                toast.error("Error", { description: "Appointment date and time is not finalized. Please try again.", });
                console.error("Error updating event:", error);
            }
        } else {
            toast.error("Error", { description: "Need to select client file with the search underneath the calendar on the left side bar.", });
        }

    };

    const handleBrand = (e) => {
        setBrandId(e);
        setClientApt((prev) => ({
            ...prev,
            brand: e,
        }));
    };

    useEffect(() => {
        async function getData() {
            const res = await fetch(`${VITE_API_URL}/sales/calendar/clientsetter/models/${brandId}`);
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            return res.json();
        }
        if (brandId.length > 3) {
            const fetchData = async () => {
                const result = await getData();
                setModelList(result);
                console.log(brandId, result); // Log the updated result
            };
            fetchData();
        }

    }, [brandId]);

    const GetSearch = async (e) => {
        const result = await axios.get(`${VITE_API_URL}/sales/calendar/clientsetter/user?q=${e.currentTarget.value}`)
        const data = result.data;
        setUserSearch(data.result)
    }
    const GetClientSearch = async (e) => {
        const result = await axios.get(`${VITE_API_URL}/sales/calendar/clientsetter/clientsearch?q=${e.currentTarget.value}`)
        const data = result.data;
        setSearch(data.result)
    }
    const eventPropGetter = (event) => {
        let newStyle
        if (event.id === '666') {
            newStyle = {
                borderColor: '#000000',
                color: '#000000',
                textColor: '#000000',
                backgroundColor: '#0dbc79',
            };
        }
        return {
            style: newStyle
        };
    };
    async function fetchData(email) {
        async function getApts() {
            try {
                const result = await axios.get(`${VITE_API_URL}/sales/calendar/clientsetter/${email}`)
                const data = result.data.data;
                setSalesData(data.appts);
                setUser(data.user);
                const d = data.salesData?.map((event) => ({ ...event, start: new Date(event.start), end: new Date(event.end), isDraggable: false }));
                console.log(d, 'd1');
                setEvents(d);
                return data;
            } catch (error) {
                toast.error("Error", { description: "Something went wrong and we couldn't not obtain the sales persons appointments to display. Try reloading the page..", duration: 10000 });
                console.error("Error fetching all data:", error);
            }
        }
        await getApts();
        setOpen(false);
    }
    const u = d
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minTime = new Date();
    minTime.setHours(8, 30, 0);
    const maxTime = new Date();
    maxTime.setHours(21, 0, 0);


    const HoverEvent = ({ event, day, label }) => {
        const options2 = { weekday: "short", hour: "2-digit", minute: "2-digit" };
        let start = new Date(event.start).toLocaleDateString("en-US", options2)
        let end = new Date(event.end).toLocaleDateString("en-US", options2)
        start = JSON.stringify(start);
        end = JSON.stringify(end);
        const title = event?.id === clientApt?.id ? event?.title : ''
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center cursor-pointer rounded-md w-full  my-auto hover:text-primary">
                            <p className=" text-center my-auto capatilize ">{start.toLocaleString()} - {end.toLocaleString()}</p>
                            <p className='text-muted-foreground'>{title}</p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="grid grid-cols-1  border-border rounded-md p-3">
                        <p>{start.toLocaleString()} - {end.toLocaleString()}</p>
                        <p className='text-muted-foreground'>{title}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };
    const onEventResize: withDragAndDropProps['onEventResize'] = (data) => {
        if (completed === true) { return; }
        try {
            const { event, start, end } = data;
            const durationInHours = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
            if (durationInHours > 2) { toast.error("Error", { description: "Event duration cannot exceed 2 hours. Please choose a shorter time frame.", duration: 10000 }); return; }
            const isOverlapping = (start1, end1, start2, end2) => { return start1 < end2 && end1 > start2; };
            const hasOverlap = u.some((a) => {
                if (a.id === event.id) return false;
                return isOverlapping(
                    new Date(start),
                    new Date(end),
                    new Date(a.start),
                    new Date(a.end)
                );
            });
            if (hasOverlap) { toast.error("Error", { description: "The appointment overlaps with an existing appointment. Please choose a different time.", duration: 10000 }); return; }
            const updatedApt = {
                ...clientApt,
                start,
                end,
                userEmail: user?.email,
            };
            setClientApt(updatedApt);
            setSalesData((prev) => {
                const eventId = event.id
                const existing = prev.find((ev) => ev?.id === eventId) ?? {};
                const filtered = prev.filter((ev) => ev?.id !== eventId);
                return [...filtered, { ...existing, start, end, userEmail: user?.email, }];
            });
            toast.success("Success", { description: "Successfully set appointment time, be sure to save the appointment on the left side bar.", duration: 10000 });
        } catch (error) {
            toast.error("Error", { description: "Appointment date and time is not set. Please try again.", duration: 10000 });
            console.error("Error updating event:", error);
        }
    };
    const onEventDrop: withDragAndDropProps['onEventDrop'] = data => {
        const { event, start, end } = data;
        if (completed === true) { return; }
        const isOverlapping = (start1, end1, start2, end2) => { return start1 < end2 && end1 > start2; };
        const hasOverlap = u.some((a) => {
            if (a.id === event.id) return false;
            return isOverlapping(
                new Date(start),
                new Date(end),
                new Date(a.start),
                new Date(a.end)
            );
        });
        if (hasOverlap) { toast.error("Error", { description: "The appointment overlaps with an existing appointment. Please choose a different time.", duration: 10000 }); return; }
        try {
            const updatedApt = {
                ...clientApt,
                start,
                end,
                userEmail: user?.email,
            };
            setClientApt(updatedApt);
            setSalesData((prev) => {
                const eventId = event.id
                console.log(eventId, 'eventId')
                const existing = prev.find((ev) => ev?.id === eventId) ?? {};
                const filtered = prev.filter((ev) => ev?.id !== eventId);
                return [...filtered, { ...existing, start, end, userEmail: user?.email, }];
            });
            toast.success("Success", { description: "Successfully set appointment time, be sure to save the appointment on the left side bar.", duration: 10000 });
        } catch (error) {
            toast.error("Error", { description: "Appointment date and time is not set. Please try again.", duration: 10000 });
            console.error("Error updating event:", error);
        }
    }
    return (
        <div className=" max-w-[100vw] w-full overflow-x-hidden max-h-[100vh] h-full overflow-y-hidden flex justify-start   bg-background ">
            <div className="flex justify-start border-t  border-border grow">
                <div className="flex justify-start h-screen w-[400px]">
                    <div className="mt-3 flex-col justify-center bg-background mx-auto">
                        <div className="grid grid-cols-1 mx-auto w-[400px] rounded-md border-white  text-foreground justify-center ">
                            <div className="  my-3 flex justify-center   w-[400px]  ">
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
                        <div className=" mt-3 grid grid-cols-1  justify-center gap-3 w-[95%] mx-auto">
                            <ViewToolbar setView={setView} />
                            <Button
                                disabled={completed}
                                variant="outline"
                                className="w-[180px]  mx-auto justify-self-center"
                                onClick={() => setOpen(true)}
                            >
                                {user ? user.username : 'Set Sales Person'}
                            </Button>
                            <Label className='text-muted-foreground text-xs text-center' >You can change sales people before finalizing your appointment at any time.</Label>
                            <input type="hidden" value={String(date)} name="value" />
                            {completed === false && (
                                <>
                                    {!clientApt?.clientfileId && !clientApt?.financeId ? (
                                        <Command>
                                            <div>
                                                <div className="relative ml-auto flex-1  ">
                                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        ref={searchRef}
                                                        type="search"
                                                        name="q"
                                                        onChange={(e) => {
                                                            GetClientSearch(e)
                                                        }}
                                                        autoFocus
                                                        placeholder="Search..."
                                                        className="w-full rounded-b-none bg-background pl-8 "
                                                    />
                                                </div>
                                            </div>
                                            <CommandList className="h-auto max-h-[500px] overflow-y-auto border border-[#27272a] rounded-[6px] rounded-t-none">
                                                <CommandGroup heading="Search Clients">
                                                    {search &&
                                                        search.map((result, index) => {
                                                            return (
                                                                <>
                                                                    <CommandEmpty>No results found.</CommandEmpty>
                                                                    <CommandItem>
                                                                        <Button
                                                                            variant="ghost"
                                                                            key={index}
                                                                            className="hover:bg-accent hover:text-accent-foreground  w-full h-auto font-medium grid grid-cols-1 items-start "
                                                                            onClick={() => {
                                                                                setClientApt((prev) => ({
                                                                                    ...prev,
                                                                                    financeId: result.id,
                                                                                    clientfileId: result.clientfileId,
                                                                                    unit: `${result.year} ${result.brand} ${result.model}`,
                                                                                    brand: result.brand,
                                                                                    firstName: result.firstName,
                                                                                    lastName: result.lastName,
                                                                                    email: result.email,
                                                                                    phone: result.phone,
                                                                                    address: result.address,
                                                                                    intent: "dragAndDrop",
                                                                                }));
                                                                                setClientName(`${result.firstName} ${result.lastName}`)
                                                                                //setBrandId(result.brand)
                                                                                //  setModel(result.model)
                                                                                toast.success(`Selected client file!`, {
                                                                                    duration: 10000
                                                                                });
                                                                            }}
                                                                        >
                                                                            <div className='flex items-center justify-between text-[14px]'>
                                                                                <p className="text-foreground ">{result.firstName} {result.lastName}</p>
                                                                                <p className="text-center text-muted-foreground">{result.phone} </p>
                                                                                <p className="text-right text-muted-foreground">{result.email}</p>
                                                                            </div>
                                                                            <p className="text-left">{result.year} {result.brand} {result.model}</p>

                                                                        </Button>
                                                                    </CommandItem>
                                                                </>
                                                            );
                                                        })}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    ) : (null)}
                                </>
                            )}
                            {completed === false && (
                                <>
                                    {clientApt?.clientfileId && clientApt?.financeId && (
                                        <>

                                            <div className="relative mt-3 mx-auto w-[350px] ">
                                                <Input
                                                    className=" col-span-3 bg-background border-border"
                                                    type="text"
                                                    list="ListOptions1"
                                                    name="brand"
                                                    value={brandId}
                                                    onChange={(e) => handleBrand(e.currentTarget.value)}
                                                />
                                                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                                    Brand
                                                </label>
                                            </div>
                                            <datalist id="ListOptions1">
                                                <option value="Can-Am" />
                                                <option value="Can-Am-SXS" />
                                                <option value="an-Am-SXS-MY24" />
                                                <option value="Harley-Davidson" />
                                                <option value="Harley-DavidsonMY24" />
                                                <option value="Indian" />
                                                <option value="Kawasaki" />
                                                <option value="KTM" />
                                                <option value="Manitou" />
                                                <option value="Sea-Doo" />
                                                <option value="Switch" />
                                                <option value="Ski-Doo" />
                                                <option value="Ski-Doo-MY24" />
                                                <option value="Suzuki" />
                                                <option value="Triumph" />
                                                <option value="Spyder" />
                                                <option value="Yamaha" />
                                                <option value="Used" />
                                            </datalist>

                                            {modelList || brandId && (
                                                <>
                                                    <div className="relative mt-3 w-[350px] ">
                                                        <Input
                                                            className=" col-span-3 bg-background border-border"
                                                            type="text"
                                                            list="ListOptions2"
                                                            name="model"
                                                            value={model}
                                                            onChange={(e) => {
                                                                setModel(e.currentTarget.value)
                                                                setClientApt((prev) => ({
                                                                    ...prev,
                                                                    unit: `${brandId} ${e}`,
                                                                }));
                                                            }}
                                                        />
                                                        <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                                            Model
                                                        </label>
                                                    </div>
                                                    <datalist id="ListOptions2">
                                                        {modelList.map((item, index) => (
                                                            <option key={index} value={item.model} />
                                                        ))}
                                                    </datalist>
                                                </>
                                            )}
                                            <div className="relative mt-3 mx-auto w-[350px] ">
                                                <Textarea defaultValue={note} onChange={(e) => setNote(e.currentTarget.value)} />
                                                <label className=" absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Note</label>
                                            </div>
                                            <div className="relative  mt-3 mx-auto w-[350px] ">
                                                <Textarea defaultValue={description} onChange={(e) => setDescription(e.currentTarget.value)} />
                                                <label className=" absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Description</label>
                                            </div>

                                            <Button
                                                size='sm'
                                                variant='outline'
                                                className=' mx-auto w-[180px] '
                                                onClick={() => {
                                                    setClientApt((prev) => ({
                                                        ...prev,
                                                        note: note,
                                                        description: description,
                                                    }));
                                                }}>
                                                Save
                                            </Button>
                                        </>
                                    ) }
                                </>
                            )}

                        </div>
                    </div>
                </div>
                <div className="grid max-w-[100%] max-h-[100%] h-full w-full justify-center overflow-x-auto overflow-y-auto">

                    {completed === false ? (
                        <div className='grid grid-cols-3 justify-center items-center  gap-3 mt-3 mr-3' >
                            <div className='grid  gap-3' >
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label >Interested Brand</Label>
                                    <Input defaultValue={clientApt?.brand} readOnly />
                                    <Label className='text-muted-foreground  text-xs' >You can change models at anytime, just on the left bellow the calendar.</Label>
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label >Interested Model</Label>
                                    <Input defaultValue={clientApt?.unit} readOnly />
                                    <Label className='text-muted-foreground' ></Label>
                                </div>
                            </div>
                            <div className='grid  gap-3' >
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label >Client Name</Label>
                                    <Input defaultValue={clientName} readOnly />
                                    <Label className='text-muted-foreground text-xs' >If these fields are empty, just remember to search for your client file in the left side bar below the calendar.</Label>
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label >Client Phone</Label>
                                    <Input defaultValue={clientApt?.phone} readOnly />
                                    <Label className='text-muted-foreground' ></Label>
                                </div>
                            </div>
                            <div className='grid  gap-3' >
                                <div className={!clientApt?.clientfileId && !clientApt?.financeId ? 'grid w-full max-w-sm items-center gap-1.5  mb-[106px]' : "grid w-full max-w-sm items-center gap-1.5 mb-[48px]"}>
                                    <Label >Client Email</Label>
                                    <Input defaultValue={clientApt?.email} readOnly />
                                    <Label className='text-muted-foreground' ></Label>
                                </div>
                                {clientApt?.clientfileId && clientApt?.financeId && finalizeAppt ===false && (
                                    <Button
                                        variant='outline'
                                        className='mb-[6px]'
                                        onClick={() => {
                                            const appointments = u;
                                            const sortedAppointments = [...appointments].sort((a, b) => new Date(a.start) - new Date(b.start));

                                            const businessStart = new Date();
                                            businessStart.setHours(8, 30, 0, 0);
                                            const businessEnd = new Date();
                                            businessEnd.setHours(21, 0, 0, 0);

                                            const now = new Date();
                                            let searchStart = new Date(Math.max(now.getTime(), businessStart.getTime()));

                                            if (searchStart.getMinutes() % 30 !== 0) {
                                                searchStart.setMinutes(Math.ceil(searchStart.getMinutes() / 30) * 30, 0, 0);
                                                if (searchStart.getMinutes() === 60) {
                                                    searchStart.setHours(searchStart.getHours() + 1);
                                                    searchStart.setMinutes(0, 0, 0);
                                                }
                                            }

                                            const appointmentDuration = 60 * 60 * 1000; // 1 hour in milliseconds

                                            const findFirstAvailableSlot = () => {
                                                // Create a list of all busy slots from appointments
                                                const busySlots = sortedAppointments.map(appt => ({
                                                    start: new Date(appt.start),
                                                    end: new Date(appt.end)
                                                }));

                                                // Start from current time or business start, whichever is later
                                                let currentTime = new Date(Math.max(now.getTime(), businessStart.getTime()));

                                                // Round up to the nearest 30 minutes
                                                if (currentTime.getMinutes() % 30 !== 0) {
                                                    currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 30) * 30, 0, 0);
                                                }

                                                // Set maximum search limit (e.g., 7 days from now)
                                                const maxSearchDate = new Date();
                                                maxSearchDate.setDate(maxSearchDate.getDate() + 7);

                                                // Try each possible time slot until we find one that works
                                                while (currentTime < maxSearchDate) {
                                                    // Skip to next business day if after business hours
                                                    if (currentTime.getHours() >= businessEnd.getHours()) {
                                                        currentTime.setDate(currentTime.getDate() + 1);
                                                        currentTime.setHours(businessStart.getHours(), businessStart.getMinutes(), 0, 0);
                                                        continue;
                                                    }

                                                    // Calculate the end time for this potential slot
                                                    const potentialEnd = new Date(currentTime.getTime() + appointmentDuration);

                                                    // Check if this slot ends after business hours
                                                    if (potentialEnd.getHours() > businessEnd.getHours() ||
                                                        (potentialEnd.getHours() === businessEnd.getHours() && potentialEnd.getMinutes() > businessEnd.getMinutes())) {
                                                        // Move to next day
                                                        currentTime.setDate(currentTime.getDate() + 1);
                                                        currentTime.setHours(businessStart.getHours(), businessStart.getMinutes(), 0, 0);
                                                        continue;
                                                    }

                                                    // Check if the slot overlaps with any busy slot
                                                    let isOverlapping = false;
                                                    for (const busy of busySlots) {
                                                        if (currentTime < busy.end && potentialEnd > busy.start) {
                                                            // Found an overlap - move currentTime to the end of this busy slot
                                                            currentTime = new Date(busy.end);

                                                            // Round up to the nearest 30 minutes
                                                            if (currentTime.getMinutes() % 30 !== 0) {
                                                                currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 30) * 30, 0, 0);
                                                            }

                                                            isOverlapping = true;
                                                            break;
                                                        }
                                                    }

                                                    // If we found a non-overlapping slot, return it
                                                    if (!isOverlapping) {
                                                        return {
                                                            start: currentTime,
                                                            end: potentialEnd
                                                        };
                                                    }
                                                }

                                                // If we reach here, we couldn't find a slot within the search limit
                                                return {
                                                    start: new Date(businessStart.getTime()),
                                                    end: new Date(businessStart.getTime() + appointmentDuration)
                                                };
                                            };
                                            const { start, end } = findFirstAvailableSlot();
                                            const updatedApt = {
                                                ...clientApt,
                                                start: start,
                                                end: end,
                                                id: '666',
                                            };
                                            console.log(updatedApt, 'updatedApt')
                                            setFinalizeAppt(true);
                                            setClientApt(updatedApt);
                                            setSalesData((prev) => [...prev, updatedApt]);

                                        }}
                                    >
                                        Find First Available Time
                                    </Button>
                                )}
                                 {finalizeAppt === true &&  (
                                        <Button
                                            size='sm'
                                            variant='outline'
                                            onClick={async () => {
                                                setCompleted(true)
                                                setFinalizeAppt(false);
                                                await saveApt()
                                            }}>
                                            Finalize Appointment
                                        </Button>
                                     )}
                            </div>
                        </div>
                    ) :  (
                        <p className='my-auto text-center'>Appointment set and finalized!</p>
                    ) }
                    <DnDCalendar
                        events={u}
                        localizer={localizer}
                        onEventDrop={onEventDrop}
                        onEventResize={onEventResize}
                        date={date}
                        min={minTime}
                        max={maxTime}
                        onNavigate={onNavigate}
                        eventPropGetter={eventPropGetter}
                        defaultView={Views.WEEK}
                        onView={onView}
                        view={view}
                        style={{
                            width: '70vw',
                            height: '80vh',
                        }}
                        components={{
                            toolbar: noToolbar,
                            event: HoverEvent,
                        }}
                    />
                </div>
            </div>
            <CommandDialog open={open} onOpenChange={setOpen} className='border border-[#27272a] rounded-[6px]'>
                <div  >
                    <div className="relative ml-auto flex-1  ">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            ref={searchRef}
                            type="search"
                            name="q"
                            onChange={(e) => {
                                GetSearch(e)
                            }}
                            autoFocus
                            placeholder="Search..."
                            className="w-full rounded-b-none bg-background pl-8 "
                        />
                    </div>
                </div>
                <CommandList className="h-auto max-h-[600px] overflow-y-auto">
                    <CommandGroup heading="Search sales people ">
                        {userSearch &&
                            userSearch.map((result, index) => {
                                return (
                                    <>
                                        <CommandEmpty>No results found.</CommandEmpty>
                                        <CommandItem>
                                            <Button
                                                variant="ghost"
                                                key={index}
                                                className="hover:bg-accent hover:text-accent-foreground  w-full h-auto font-medium grid grid-cols-1 items-start "
                                                onClick={(e) => {
                                                    setUser(result)
                                                    fetchData(result.email);
                                                    setOpen(false)
                                                    toast.success(`Selected ${result.username} as your sales person!`, {
                                                        description: "Next search for your client file in the left side bar.",
                                                        duration: 10000
                                                    });
                                                }}  >
                                                <div className='flex items-center justify-between text-[14px]'>
                                                    <p className="text-left">{result.username} </p>
                                                    <p className="text-foreground text-right">{result.email}</p>
                                                </div>
                                            </Button>
                                        </CommandItem>
                                    </>
                                );
                            })}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
    )
}

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_APP_URL = import.meta.env.VITE_APP_URL;


const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1)
const now = new Date()
const start = endOfHour(now)
const end = addHours(start, 2)
const locales = {
    'en-US': enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

//@ts-ignore
const DnDCalendar = withDragAndDrop(Calendar)


