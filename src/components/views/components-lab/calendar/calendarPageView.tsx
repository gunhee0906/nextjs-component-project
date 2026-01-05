"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import axios from "axios";
import { useEffect } from "react";
import SelectBox from "@/components/common/selectBox";
export default function CalendarPageView() {
  const getHoliday = async () => {
    await axios.get(
      `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo`,
      {
        params: {
          serviceKey:
            "8d67e5b2bbe18651c2be0a7f5d827030c6170eb37783ed8a8314fcf39a8046a7", // URL Decode 키
          solYear: 2025,
          numOfRows: 100,
          pageNo: 1,
          _type: "json",
        },
      }
    );
  };

  useEffect(() => {
    getHoliday();
  }, []);
  return (
    <>
      {/* listWeek, dayGridMonth , timeGridWeek , timeGridDay */}
      <div className="relative">
        <div className="absolute left-4 top-2 z-10">
          <SelectBox />
        </div>
        <FullCalendar
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
            listPlugin,
          ]}
          initialView="listWeek"
          height="100%"
          weekends={true}
          locale={"ko"}
          events={[
            { title: "event 1", date: "20251217 11:00:00" },
            { title: "event 2", date: "20251220" },
            { title: "event 3", date: "20251220" },
            { title: "event 4", date: "20251220" },
          ]}
          headerToolbar={{
            center: "title",
            left: "today prev,next",
            right: "",
          }}
          buttonText={{
            today: "오늘",
          }}
          dayHeaderContent={(arg) => {
            // getDay() > 6 : 토요일 , 0 > 일요일
            const day = arg.date.getDay();

            let color = "inherit";
            if (day === 6) color = "#9a9ad6"; // 토요일
            if (day === 0) color = "#df6767"; // 일요일

            return <span style={{ color }}>{arg.text}</span>;
          }}
          dayCellClassNames={(arg) => {
            if (arg.date.getDay() === 0) return ["sunday"];
            if (arg.date.getDay() === 6) return ["saturday"];
            return [];
          }}
          eventClick={() => console.log("일정 선택")}
          editable={true} // Event 이동 허용
          selectable={true}
          dayMaxEvents={4}
          dayMaxEventRows={2}
          fixedWeekCount={false}
        />
      </div>
    </>
  );
}
