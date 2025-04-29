"use client";

import { useState, useEffect } from "react";
import ECharts from "echarts-for-react";
import { EChartsOption } from "echarts-for-react/src/types";
import { API_VERSION, SERVER_API_URL } from "../../../../../../utils/global";
import { VisitChartVO } from "../../../../../../types";
import { FETCH } from "../../../../../../lib/utils";

const ChartVisit = () => {
  const [chartOptions, setChartOptions] = useState<EChartsOption>({});

  const onListData = async () => {
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
            data: result?.list?.map((visitChartVO: VisitChartVO) => {
              return {
                value: visitChartVO?.visitCount,
                name: visitChartVO?.weekDay,
              };
            }),
          },
        ],
      };
      setChartOptions(options);
    } catch (error) {}
  };

  useEffect(() => {
    onListData();
  }, []);

  return (
    <>
      <h3>요일별 통계</h3>
      <ECharts option={chartOptions} />
    </>
  );
};

export default ChartVisit;
