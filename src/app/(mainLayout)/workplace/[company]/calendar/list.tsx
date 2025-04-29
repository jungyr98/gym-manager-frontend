"use client";

import React from "react";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar, Button, Modal } from "antd";
import ko from "antd/es/calendar/locale/ko_KR";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import CalendarForm from "./form";
import {
  SERVER_API_URL,
  API_VERSION,
  URLParams,
} from "../../../../../utils/global";
import "./style.css";
import { CalendarVO } from "../../../../../types";
import { FETCH } from "../../../../../lib/utils";

/**
 * 일정 관리
 * @returns CalendarList
 */
const CalendarList = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<CalendarVO>();
  const [listData, setListData] = useState<Array<CalendarVO>>();
  const [selectedDate, setSelectedDate] = useState<Dayjs>();

  // 목록 데이터 호출
  const onListData = async () => {
    const searchParams = {
      wpSeq: 1,
      searchYear: dayjs().format("YYYY"),
    };

    const quaryString = URLParams(searchParams);

    try {
      await FETCH(`${SERVER_API_URL}/${API_VERSION}/calendar?${quaryString}`)
        .then((res) => res?.json())
        .then((res) => {
          setListData(res?.result);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {}
  };

  // 상세 모달 OPEN
  const onDetail = (item: CalendarVO) => {
    setOpen(true);
    setDetailData(item);
  };

  // 등록 모달 OPEN
  const onInsert = () => {
    setOpen(true);
    setSelectedDate(undefined);
    setDetailData(undefined);
  };

  // 일자별 일정 데이터 세팅
  const getListData = (value: Dayjs) => {
    let calendarData: CalendarVO[] = [];

    listData?.map((calendarVO: CalendarVO) => {
      if (
        value?.format("YYYY-MM-DD") ===
        dayjs(calendarVO?.regDate).format("YYYY-MM-DD")
      ) {
        calendarData.push({
          clSeq: calendarVO?.clSeq,
          clType: calendarVO?.clType,
          clContent: calendarVO?.clContent,
          regDate: calendarVO?.regDate,
        });
      }
    });

    return calendarData || [];
  };

  // 월별 일정 데이터 세팅
  const getMonthData = (value: Dayjs) => {
    let content: string[] = [];
    listData?.map((calendarVO: CalendarVO) => {
      if (
        value.month() + 1 ===
        Number(dayjs(calendarVO?.regDate).format("M"))
      ) {
        calendarVO?.clContent && content.push(calendarVO?.clContent);
      }
    });

    return content || undefined;
  };

  // [년] Tab 렌더링
  const monthCellRender = (value: Dayjs) => {
    let content = getMonthData(value);
    return content?.map((item: string) => (
      <div className="notes-month">
        <section>{item}</section>
      </div>
    ));
  };

  // [월] Tab 렌더링
  const dateCellRender = (value: Dayjs) => {
    const list = getListData(value);
    return (
      <ul className="events">
        {list.map((item: CalendarVO) => (
          <li key={item?.clContent} onClick={() => onDetail(item)}>
            <Badge
              status={
                item.clType === "D"
                  ? "success"
                  : ("warning" as BadgeProps["status"])
              }
              text={item.clContent}
            />
          </li>
        ))}
      </ul>
    );
  };

  // 캘린더 탭별(월/년) 렌더링 변경
  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  const onSelect = (newValues: Dayjs) => {
    setSelectedDate(newValues);
  };

  useEffect(() => {
    onListData();
  }, []);

  /* Return */
  return (
    <>
      {/* 캘린더 */}
      <Button className="calendarInsertBtn" type="primary" onClick={onInsert}>
        일정 등록하기
      </Button>
      <Calendar locale={ko} cellRender={cellRender} onSelect={onSelect} />

      {/* 일정 폼 Modal */}
      <Modal
        title={"일정 관리"}
        open={open}
        width={600}
        onCancel={() => {
          if (confirm("저장되지 않은 내용은 모두 삭제됩니다.")) {
            setOpen(false);
          }
        }}
        destroyOnClose={true}
        footer={null}
      >
        <CalendarForm
          clSeq={detailData?.clSeq}
          selectedDate={selectedDate?.format("YYYY-MM-DD")}
          onSaveComplete={() => {
            setOpen(false);
            onListData(); // 목록 데이터 호출
          }}
        />
      </Modal>
    </>
  );
};

export default CalendarList;
