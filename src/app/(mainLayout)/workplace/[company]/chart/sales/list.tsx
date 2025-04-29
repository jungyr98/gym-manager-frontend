"use client";

import { useState, useEffect } from "react";
import ECharts from "echarts-for-react";
import { EChartsOption } from "echarts-for-react/src/types";
import { API_VERSION, SERVER_API_URL } from "../../../../../../utils/global";
import { Form, Select, DatePicker, Divider } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import "./style.css";
import { SalesChartVO } from "../../../../../../types";
import { FETCH } from "../../../../../../lib/utils";

/**
 * 매출 통계 차트
 * @returns ChartSales
 */
const ChartSales = () => {
  const [form] = useForm();
  const [membershipChartOptions, setMembershipChartOptions] =
    useState<EChartsOption>({});
  const [yearChartOptions, setYearChartOptions] = useState<EChartsOption>({});
  const [ageChartOptions, setAgeChartOptions] = useState<EChartsOption>({});

  // 년도별 월 매출 데이터 호출
  const onMonthListData = async () => {
    const firstSearchYear = dayjs(form.getFieldValue("firstSearchYear")).format(
      "YYYY"
    );
    const secondSearchYear = dayjs(
      form.getFieldValue("secondSearchYear")
    ).format("YYYY");

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
        legend: {},
        series: [
          {
            name: firstSearchYear + "년",
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
            name: secondSearchYear + "년",
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

  // 회원권 별 매출 데이터 호출
  const onMembershipListData = async () => {
    const thirdSearchYear = dayjs(form.getFieldValue("thirdSearchYear")).format(
      "YYYY"
    );

    try {
      const result = await FETCH(
        `${SERVER_API_URL}/${API_VERSION}/chart/sales/membership?year=${thirdSearchYear}`
      )
        .then((res) => res?.json())
        .then((res) => {
          return res?.result;
        })
        .catch((e) => console.log(e));

      // 차트 Config
      const options: EChartsOption = {
        xAxis: {
          data: result?.list?.map((salesChartVO: SalesChartVO) => {
            return salesChartVO?.membershipName;
          }),
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            data: result?.list?.map((salesChartVO: SalesChartVO) => {
              return {
                value: salesChartVO?.totalPrice,
                name: salesChartVO?.membershipName,
              };
            }),
            barWidth: "30%",
            emphasis: {
              focus: "series",
              label: {
                show: true,
                formatter: result?.list?.map((salesChartVO: SalesChartVO) => {
                  return salesChartVO?.totalPrice;
                }),
                position: "top",
              },
            },
          },
        ],
      };
      setMembershipChartOptions(options);
    } catch (error) {}
  };

  const onAgeListData = async () => {
    const thirdSearchYear = dayjs(form.getFieldValue("thirdSearchYear")).format(
      "YYYY"
    );

    try {
      const result = await FETCH(
        `${SERVER_API_URL}/${API_VERSION}/chart/sales/age?year=${thirdSearchYear}`
      )
        .then((res) => res?.json())
        .then((res) => {
          return res?.result;
        })
        .catch((e) => console.log(e));

      // 차트 Config
      const options: EChartsOption = {
        // title: {
        //   text: "Referer of a Website",
        //   subtext: "Fake Data",
        //   left: "center",
        // },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "Total Price",
            type: "pie",
            radius: "50%",
            data: result?.list?.map((salesChartVO: SalesChartVO) => {
              return {
                value: salesChartVO?.totalPrice,
                name: salesChartVO?.ageGroup,
              };
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      setAgeChartOptions(options);
    } catch (error) {}
  };

  useEffect(() => {
    onMonthListData();
    onMembershipListData();
    onAgeListData();
  }, []);

  return (
    <>
      <div>
        <Form form={form}>
          <h3>연도별 통계</h3>
          <div className="year-chart-search-box year-chart-search-box-fisrt">
            <span className="year-chart-color-span year-chart-color-span-first"></span>
            <Form.Item
              name={"firstSearchYear"}
              initialValue={dayjs().add(-1, "year")}
              noStyle
            >
              <DatePicker
                picker="year"
                onChange={onMonthListData}
                allowClear={false}
              />
            </Form.Item>
          </div>
          <div className="year-chart-search-box">
            <span className="year-chart-color-span year-chart-color-span-second"></span>
            <Form.Item name={"secondSearchYear"} initialValue={dayjs()} noStyle>
              <DatePicker
                picker="year"
                onChange={onMonthListData}
                allowClear={false}
              />
            </Form.Item>
          </div>
          <ECharts option={yearChartOptions} />
          <Divider />
          <div>
            <Form.Item name={"thirdSearchYear"} initialValue={dayjs()} noStyle>
              <DatePicker
                picker="year"
                onChange={() => {
                  onMembershipListData();
                  onAgeListData();
                }}
                prefix={<SearchOutlined />}
                allowClear={false}
              />
            </Form.Item>
          </div>
          <div className="extra-chart-box">
            <div style={{ width: "60%" }}>
              <h3>회원권 별 통계</h3>
              <ECharts option={membershipChartOptions} />
            </div>
            <div style={{ width: "40%" }}>
              <h3>연령별 통계</h3>
              <ECharts option={ageChartOptions} />
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ChartSales;
