"use client";

import { useEffect, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer, Views, View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "moment/locale/pt"; // Ensure moment speaks Portuguese
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { Calendar as CalendarIcon } from "lucide-react";
import Swal from "sweetalert2";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { BookingRow } from "@/lib/api/types";

// Setup the localizer
moment.locale('pt');
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(BigCalendar);

interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    booking: BookingRow;
    resourceId?: number;
}

export default function CalendarPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState<View>(Views.MONTH);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    async function fetchBookings() {
        setLoading(true);
        try {
            const data = await apiFetch<BookingRow[]>(endpoints.bookings.list(1000));
            const calendarEvents = data.map((b) => ({
                id: b.id,
                title: `${b.vehicle_title} - ${b.customer_name} (${b.status})`,
                start: new Date(b.start_at),
                end: new Date(b.end_at),
                booking: b,
                resourceId: b.vehicle_id,
            }));
            setEvents(calendarEvents);
        } catch (e: any) {
            console.error("Failed to load bookings for calendar", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleEventDrop = async ({ event, start, end }: any) => {
        const targetEvent = event as CalendarEvent;
        const updatedEvents = events.map(ev =>
            ev.id === targetEvent.id ? { ...ev, start, end } : ev
        );
        setEvents(updatedEvents); // Optimistic UI update

        try {
            // Push update to backend
            const payload = {
                vehicleId: targetEvent.booking.vehicle_id,
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                status: targetEvent.booking.status
            };

            await apiFetch(endpoints.bookings.update(targetEvent.id), {
                method: "PUT",
                body: JSON.stringify(payload)
            });
            // Re-fetch to normalize formatting and ensure total_price recalculation propagates 
            // if we needed to display it, but optimistic update is usually fine.
            fetchBookings();
        } catch (error) {
            console.error("Failed to update booking dates", error);
            // Revert changes on fail
            fetchBookings();
            Swal.fire({ icon: "error", title: "Erro", text: "Erro ao tentar atualizar as datas da reserva.", confirmButtonColor: "#3085d6" });
        }
    };

    const handleEventResize = async ({ event, start, end }: any) => {
        // Equivalent to drop for now, updates dates.
        handleEventDrop({ event, start, end });
    };

    // Style events based on booking status
    const eventPropGetter = (event: CalendarEvent) => {
        let backgroundColor = '#3b82f6'; // primary blue
        switch (event.booking.status) {
            case 'PENDENTE':
                backgroundColor = '#f59e0b'; // amber
                break;
            case 'CONFIRMADA':
                backgroundColor = '#10b981'; // green
                break;
            case 'EM_CURSO':
                backgroundColor = '#3b82f6'; // blue
                break;
            case 'CONCLUÍDA':
                backgroundColor = '#64748b'; // slate
                break;
            case 'CANCELADA':
                backgroundColor = '#ef4444'; // red
                break;
        }
        return { style: { backgroundColor } };
    };

    return (
        <div>
            <TopNav
                title="Calendário de Alugueres"
                subtitle="Visão geral e remarcações"
            />
            <PageShell>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 h-[800px]">
                    {loading ? (
                        <div className="flex flex-col h-full items-center justify-center gap-6">
                            <CalendarIcon className="w-10 h-10 text-primary animate-pulse" />
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">A carregar calendário...</p>
                        </div>
                    ) : (
                        <DnDCalendar
                            localizer={localizer}
                            events={events}
                            onEventDrop={handleEventDrop}
                            onEventResize={handleEventResize}
                            resizable
                            style={{ height: '100%' }}
                            view={currentView}
                            onView={(view) => setCurrentView(view)}
                            date={currentDate}
                            onNavigate={(date) => setCurrentDate(date)}
                            views={[Views.MONTH, Views.WEEK, Views.DAY]}
                            eventPropGetter={eventPropGetter as any}
                            messages={{
                                next: "Seguinte",
                                previous: "Anterior",
                                today: "Hoje",
                                month: "Mês",
                                week: "Semana",
                                day: "Dia",
                                agenda: "Agenda",
                                date: "Data",
                                time: "Hora",
                                event: "Reserva",
                                noEventsInRange: "Sem reservas neste período."
                            }}
                        />
                    )}
                </div>
            </PageShell>
        </div>
    );
}
