"use client";

import { useEffect, useState } from "react";
import { Col, Row, List, Typography, Tag } from "antd";
import {
  CalendarFilled,
  BarChartOutlined,
  UserAddOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { API_VERSION, SERVER_API_URL } from "../../../../../utils/global";
import ECharts from "echarts-for-react";
import { EChartsOption } from "echarts-for-react/src/types";
import dayjs from "dayjs";
import {
  ResponseListVOPaymentsHistoryVO,
  ResponseListVOMemberVO,
  ResponseListVOCalendarVO,
  VisitChartVO,
  SalesChartVO,
  MemberVO,
  PaymentsHistoryVO,
  CalendarVO,
} from "../../../../../types";
import { FETCH } from "../../../../../lib/utils";

/**
 * 대시보드
 * @returns DashBoard
 */
const DashBoard = () => {
  const [visitChartOptions, setVisitChartOptions] = useState<EChartsOption>({});
  const [yearChartOptions, setYearChartOptions] = useState<EChartsOption>({});
  const [payHistoryData, setPayHistoryData] =
    useState<ResponseListVOPaymentsHistoryVO>({});
  const [memberHistoryData, setMemberHistoryData] =
    useState<ResponseListVOMemberVO>({});
  const [calendarHistoryData, setCalendarHistoryData] =
    useState<ResponseListVOCalendarVO>({});
  const [currentDate] = useState<string>(dayjs().format("YYYY년 MM월"));
  const [currentWeek] = useState<number>(
    dayjs().diff(dayjs().startOf("month"), "week") + 1
  ); // ISO 8601 표준 [한 주의 시작 : 월요일 기준]

  // 이번주 방문 통계 데이터 호출
  const onVisitListData = async () => {
    try {
      const result = await FETCH(
        `${SERVER_API_URL}/${API_VERSION}/chart/visit/day`
      )
        .then((res) => res?.json())
        .then((res) => {
          return res?.result;
        })
        .catch((e) => console.log(e));

      const options: EChartsOption = {
        xAxis: {
          data: [
            "월요일",
            "화요일",
            "수요일",
            "목요일",
            "금요일",
            "토요일",
            "일요일",
          ],
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            itemStyle: {
              color: "#ebca6c",
            },
            data: result?.list?.map((visitChartVO: VisitChartVO) => {
              return {
                value: visitChartVO?.visitCount,
                name: visitChartVO?.weekDay,
              };
            }),
          },
        ],
      };
      setVisitChartOptions(options);
    } catch (error) {}
  };

  // 년도별 월별 매출 데이터 호출
  const onMonthListData = async () => {
    const firstSearchYear = dayjs().subtract(1, "year").format("YYYY");
    const secondSearchYear = dayjs().format("YYYY");
    try {
      const firstResult = await FETCH(
        `${SERVER_API_URL}/${API_VERSION}/chart/sales/month?year=${firstSearchYear}`
      )
        .then((res) => res?.json())
        .then((res) => {
          return res?.result;
        })
        .catch((e) => console.log(e));

      const secondResult = await FETCH(
        `${SERVER_API_URL}/${API_VERSION}/chart/sales/month?year=${secondSearchYear}`
      )
        .then((res) => res?.json())
        .then((res) => {
          return res?.result;
        })
        .catch((e) => console.log(e));

      // 차트 Config
      const option = {
        xAxis: {
          data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            data: firstResult?.list?.map((salesChartVO: SalesChartVO) => {
              return {
                value: salesChartVO?.totalPrice,
                name: salesChartVO?.regMonth,
              };
            }),
            emphasis: {
              focus: "series",
              label: {
                show: true,
                formatter: secondResult?.list?.map(
                  (salesChartVO: SalesChartVO) => {
                    return salesChartVO?.totalPrice;
                  }
                ),
                position: "top",
              },
            },
          },
          {
            type: "bar",
            data: secondResult?.list?.map((salesChartVO: SalesChartVO) => {
              return {
                value: salesChartVO?.totalPrice,
                name: salesChartVO?.regMonth,
              };
            }),
            emphasis: {
              focus: "series",
              label: {
                show: true,
                formatter: secondResult?.list?.map(
                  (salesChartVO: SalesChartVO) => {
                    return salesChartVO?.totalPrice;
                  }
                ),
                position: "top",
              },
            },
          },
        ],
      };

      setYearChartOptions(option);
    } catch (error) {}
  };

  // 이번주 결제 내역 호출
  const onPayWeekData = async () => {
    try {
      await FETCH(`${SERVER_API_URL}/${API_VERSION}/dashboard/payWeek`)
        .then((res) => res?.json())
        .then((res) => {
          setPayHistoryData(res?.result);
        })
        .catch((e) => console.log(e));
    } catch (error) {}
  };

  // 이번주 새로 등록된 회원 목록 호출
  const onMemberWeekData = async () => {
    try {
      await FETCH(`${SERVER_API_URL}/${API_VERSION}/dashboard/memberWeek`)
        .then((res) => res?.json())
        .then((res) => {
          setMemberHistoryData(res?.result);
        })
        .catch((e) => console.log(e));
    } catch (error) {}
  };

  // 이번주 일정 목록 호출
  const onCalendarWeekData = async () => {
    try {
      await FETCH(`${SERVER_API_URL}/${API_VERSION}/dashboard/calendarWeek`)
        .then((res) => res?.json())
        .then((res) => {
          setCalendarHistoryData(res?.result);
        })
        .catch((e) => console.log(e));
    } catch (error) {}
  };

  useEffect(() => {
    onVisitListData();
    onMonthListData();
    onPayWeekData();
    onMemberWeekData();
    onCalendarWeekData();
  }, []);
  return (
    <>
      {/* Gride Start */}
      <Row gutter={[16, 24]}>
        <Col span={10} aria-label="a">
          <h3>
            방문 통계 <BarChartOutlined />
          </h3>
          <div
            style={{
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <ECharts option={visitChartOptions} />
          </div>
        </Col>
        <Col span={14}>
          <h3>
            매출 통계 <BarChartOutlined />
          </h3>
          <div
            style={{
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              padding: "0 10px",
              borderRadius: "10px",
            }}
          >
            <ECharts option={yearChartOptions} />
          </div>
        </Col>
      </Row>
      {/* Second Row */}
      <Row gutter={[16, 24]} style={{ marginTop: "20px" }}>
        <Col span={8}>
          <h3>
            결제 히스토리 <HistoryOutlined />
          </h3>
          <List
            header={
              <div>
                {currentDate}{" "}
                {currentWeek === 1
                  ? "첫"
                  : currentWeek === 2
                  ? "둘"
                  : currentWeek === 3
                  ? "셋"
                  : currentWeek === 4
                  ? "넷"
                  : "다섯"}
                째주
              </div>
            }
            bordered
            dataSource={payHistoryData?.list}
            style={{ height: "83%" }}
            renderItem={(item: PaymentsHistoryVO) => (
              <List.Item>
                <Typography.Text type="secondary">
                  {dayjs().diff(item?.regDate, "day") === 0
                    ? "오늘"
                    : dayjs().diff(item?.regDate, "day") + "일전"}
                </Typography.Text>{" "}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Tag>
                    [{item?.phType === "CARD" ? "카드결제" : "계좌이체"}]{" "}
                    {item?.phName}
                  </Tag>
                  <Typography.Text>
                    {`${item?.phPrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
                  </Typography.Text>
                </div>
              </List.Item>
            )}
          />
        </Col>
        <Col span={7}>
          <h3>
            신규 회원 <UserAddOutlined />
          </h3>
          <List
            header={
              <div>
                {currentDate}{" "}
                {currentWeek === 1
                  ? "첫"
                  : currentWeek === 2
                  ? "둘"
                  : currentWeek === 3
                  ? "셋"
                  : currentWeek === 4
                  ? "넷"
                  : "다섯"}
                째주
              </div>
            }
            bordered
            dataSource={memberHistoryData?.list}
            style={{ height: "83%" }}
            renderItem={(item: MemberVO) => (
              <List.Item>
                <Typography.Text mark>[NEW]</Typography.Text> {item?.memberName}
              </List.Item>
            )}
          />
        </Col>
        <Col span={9}>
          <h3>
            주요 일정 <CalendarFilled />
          </h3>
          <List
            header={
              <div>
                {currentDate}{" "}
                {currentWeek === 1
                  ? "첫"
                  : currentWeek === 2
                  ? "둘"
                  : currentWeek === 3
                  ? "셋"
                  : currentWeek === 4
                  ? "넷"
                  : "다섯"}
                째주
              </div>
            }
            bordered
            dataSource={calendarHistoryData?.list}
            style={{ height: "83%" }}
            renderItem={(item: CalendarVO) => (
              <List.Item>
                <Typography.Text strong>
                  [{dayjs(item?.regDate).format("YYYY-MM-DD")}]
                </Typography.Text>{" "}
                {item?.clContent}
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
};

export default DashBoard;
