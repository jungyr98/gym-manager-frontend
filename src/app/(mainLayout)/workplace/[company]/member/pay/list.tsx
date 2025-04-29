"use client";

import {
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Typography,
  Form,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  API_VERSION,
  SERVER_API_URL,
  URLParams,
} from "../../../../../../utils/global";
import dayjs from "dayjs";
import koKR from "antd/es/calendar/locale/ko_KR";
import {
  ResponseListVOPaymentsHistoryVO,
  PaymentsHistoryVO,
} from "../../../../../../types";
import { FETCH } from "../../../../../../lib/utils";

/**
 * 결제 내역
 * @returns PayList
 */
const PayList = () => {
  const router = useRouter();
  const params = useParams();
  const company = params?.company;
  const [form] = useForm();
  const [listData, setListData] = useState<ResponseListVOPaymentsHistoryVO>({});
  const [tableShowRows, setTableShowRows] = useState(10);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);

  // 상세 화면 진입
  const onDetail = (seq: number) => {
    router.push(`/workplace/${company}/member/pay/${seq}/detail`);
  };

  // 등록 화면 진입
  const onInsert = () => {
    router.push(`/workplace/${company}/member/pay/0/insert`);
  };

  // 목록 데이터 호출
  const onListData = async () => {
    setLoading(true);
    const searchParmas = {
      phName: form.getFieldValue("phName"),
      memberName: form.getFieldValue("memberName"),
      regDate:
        form.getFieldValue("regDate") !== undefined &&
        form.getFieldValue("regDate") !== null
          ? dayjs(form.getFieldValue("regDate")).format("YYYY-MM-DD")
          : null,
      currentPageNo: currentPageNo,
      recordCountPerPage: tableShowRows,
    };

    const quaryString = URLParams(searchParmas);

    try {
      await FETCH(`${SERVER_API_URL}/${API_VERSION}/member/pay?${quaryString}`)
        .then((res) => res?.json())
        .then((res) => {
          setListData(res?.result);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => setLoading(false));
    } catch (error) {}
  };

  const columns = [
    {
      title: "결제자 명",
      dataIndex: "phName",
      render: (_: number, record: PaymentsHistoryVO) => (
        <Typography.Link
          onClick={() => record?.phSeq && onDetail(record?.phSeq)}
        >
          {record?.phName}
        </Typography.Link>
      ),
    },
    {
      title: "결제 금액",
      dataIndex: "phPrice",
      render: (data: number) => `${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },
    {
      title: "결제 방법",
      dataIndex: "phType",
      render: (data: string) => (data === "CASH" ? "계좌이체" : "카드결제"),
    },
    {
      title: "결제 일자",
      dataIndex: "regDate",
      render: (data: string) => dayjs(data).format("YYYY-MM-DD"),
    },
    {
      title: "구매 명",
      dataIndex: "membershipName",
      key: "membershipName",
    },
    {
      title: "회원 명",
      dataIndex: "memberName",
      key: "memberName",
    },
  ];

  useEffect(() => {
    onListData();
  }, [currentPageNo]);

  return (
    <>
      {/* 조회 조건 */}
      <div className="search-area">
        <Form form={form} onFinish={onListData}>
          <table
            style={{
              width: "80%",
            }}
          >
            <tbody>
              <tr>
                <th align="right">결제자 명</th>
                <td>
                  <Form.Item name={"phName"} noStyle>
                    <Input allowClear />
                  </Form.Item>
                </td>
                <th align="right">회원명</th>
                <td width={100}>
                  <Form.Item name={"memberName"} noStyle>
                    <Input allowClear />
                  </Form.Item>
                </td>
                <th align="right">결제 일자</th>
                <td>
                  <Form.Item name={"regDate"} noStyle>
                    <DatePicker locale={koKR} />
                  </Form.Item>
                </td>
              </tr>
            </tbody>
          </table>
          {/* 조회 버튼 */}
          <Button type="primary" htmlType={"submit"} icon={<SearchOutlined />}>
            조회
          </Button>
        </Form>
      </div>
      <div className="btn-area-list">
        <Button type="primary" onClick={onInsert}>
          등록하기
        </Button>
      </div>
      <Table
        dataSource={listData?.list}
        columns={columns}
        rowKey={(data: any) => data?.phSeq}
        pagination={{
          defaultCurrent: 1,
          current: currentPageNo,
          pageSize: tableShowRows,
          total: listData?.totalCnt ?? 0,
          onChange: (page, pageSize) => setCurrentPageNo(page),
          position: ["bottomCenter"],
        }}
        loading={loading}
      />
    </>
  );
};

export default PayList;
