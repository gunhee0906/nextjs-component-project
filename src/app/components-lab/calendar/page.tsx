import CalendarPageView from "@/components/views/components-lab/calendar/calendarPageView";
export const metadata = {
  title: "Calendar",
};
export default function CalendarPage() {
  return (
    <>
      <div className="w-[100%] h-[100%]">
        <CalendarPageView />
      </div>
    </>
  );
}
