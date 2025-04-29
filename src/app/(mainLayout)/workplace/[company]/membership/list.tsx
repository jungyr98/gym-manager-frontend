"use client";

import {
  Table,
  Badge,
  Button,
  Input,
  Select,
  Typography,
  Form,
  Pagination,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { SearchOutlined } from "@ant-design/icons";
import {
  SERVER_API_URL,
  API_VERSION,
  URLParams,
} from "../../../../../utils/global";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import { FETCH } from "../../../../../lib/utils";

export interface ResponseJson {
  currentPageNo?: number;
  recordCountPerPage?: number;
  totalCnt?: number;
  list?: any;
}

const MembershipList = () => {
  const router = useRouter();
  const params = useParams();
  const company = params?.company;
  const [form] = useForm();
  const [listData, setListData] = useState<ResponseJson>({});
  const [tableShowRows, setTableShowRows] = useState(10);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);

  // 상세 화면 진입
  const onDetail = (seq: number) => {
    router.push(`/workplace/${company}/membership/${seq}/detail`);
  };

  // 등록 화면 진입
  const onInsert = () => {
    router.push(`/workplace/${company}/membership/0/insert`);
  };

  // 목록 데이터 호출
  const onListData = async () => {
    setLoading(true);
    const searchParams = {
      wpSeq: 1,
      membershipName: form.getFieldValue("membershipName"),
      membershipPeriod: form.getFieldValue("membershipPeriod"),
      currentPageNo: currentPageNo,
      recordCountPerPage: tableShowRows,
    };

    const quaryString = URLParams(searchParams);

    try {
      await FETCH(`${SERVER_API_URL}/${API_VERSION}/membership?${quaryString}`)
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

  const columns: ColumnsType = [
    {
      title: "회원권 이름",
      align: "center",
      dataIndex: "membershipName",
      render: (_, record) => (
        <Typography.Link onClick={() => onDetail(record?.membershipSeq)}>
          {record?.membershipName}
        </Typography.Link>
      ),
    },
    {
      title: "회원권 기간",
      align: "center",
      dataIndex: "membershipPeriod",
      width: "50%",
      render: (data: string) => <>{data}개월</>,
    },
  ];

  useEffect(() => {
    onListData();
  }, [currentPageNo]);

  return (
    <>
      {/* 검색 필터 */}
      <div className="search-area">
        <Form form={form} onFinish={onListData}>
          <table
            style={{
              width: "65%",
            }}
          >
            <tbody>
              <tr>
                <th align="right">회원권 이름</th>
                <td>
                  <Form.Item name={"membershipName"} noStyle>
                    <Input maxLength={40} allowClear />
                  </Form.Item>
                </td>
                <th align="right">회원권 기간</th>
                <td>
                  <Form.Item
                    name={"membershipPeriod"}
                    initialValue={""}
                    noStyle
                  >
                    <Select
                      options={[
                        { value: "", label: "전체" },
                        { value: "1", label: "1개월" },
                        { value: "3", label: "3개월" },
                        { value: "6", label: "6개월" },
                        { value: "12", label: "12개월" },
                      ]}
                      style={{
                        width: "100%",
                      }}
                    />
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
      {/* List Area */}
      <Table
        dataSource={listData?.list}
        columns={columns}
        rowKey={(data: any) => data?.membershipSeq}
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

export default MembershipList;
