"use client";

import {
  Table,
  Badge,
  Button,
  Input,
  Select,
  Tooltip,
  Typography,
  Form,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { SearchOutlined } from "@ant-design/icons";
import { data, useNavigate } from "react-router-dom";
import MemberListForm from "./[seq]/[type]/form";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  API_VERSION,
  SERVER_API_URL,
  URLParams,
} from "../../../../../../utils/global";
import dayjs from "dayjs";
import { ResponseListVOMemberVO, MemberVO } from "../../../../../../types";
import { FETCH } from "../../../../../../lib/utils";

/**
 * 회원 목록
 * @returns MemberList
 */
const MemberList = () => {
  const router = useRouter();
  const params = useParams();
  const company = params?.company;
  const [form] = useForm();
  const [listData, setListData] = useState<ResponseListVOMemberVO>({});
  const [tableShowRows, setTableShowRows] = useState(10);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);

  // 상세 화면 진입
  const onDetail = (seq: number) => {
    router.push(`/workplace/${company}/member/list/${seq}/detail`);
  };

  // 등록 화면 진입
  const onInsert = () => {
    router.push(`/workplace/${company}/member/list/0/insert`);
  };

  // 목록 데이터 호출
  const onListData = async () => {
    setLoading(true);
    const searchParams = {
      wpSeq: company,
      memberName: form.getFieldValue("memberName"),
      memberPhone: form.getFieldValue("memberPhone"),
      memberSex: form.getFieldValue("memberSex"),
      activeYn: form.getFieldValue("activeYn"),
      currentPageNo: currentPageNo,
      recordCountPerPage: tableShowRows,
    };
    const quaryString = URLParams(searchParams);
    try {
      await FETCH(`${SERVER_API_URL}/${API_VERSION}/member/list?${quaryString}`)
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
      title: "이름",
      dataIndex: "memberName",
      render: (_: number, record: MemberVO) => (
        <Typography.Link
          onClick={() => record?.memberSeq && onDetail(record?.memberSeq)}
        >
          {record?.memberName}
        </Typography.Link>
      ),
    },
    {
      title: "생년월일",
      dataIndex: "memberBirth",
    },
    {
      title: "전화번호",
      dataIndex: "memberPhone",
      render: (data: string) => (
        <>{data.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3")}</>
      ),
    },
    {
      title: "성별",
      dataIndex: "memberSex",
      render: (data: string) => <>{data === "M" ? "남자" : "여자"}</>,
    },
    {
      title: "주소",
      dataIndex: "memberAddr",
    },
    {
      title: "회원권 기간",
      dataIndex: "endDate",
      render: (_: number, record: MemberVO) => (
        <>
          {record?.startDate === null ||
          dayjs(record?.endDate).isBefore(dayjs()) ? (
            <>
              <Badge status="error" />{" "}
            </>
          ) : (
            <>
              <Badge status="success" />{" "}
            </>
          )}
          {record?.startDate === null
            ? "미등록"
            : dayjs(record?.startDate).format("YYYY-MM-DD") +
              "~" +
              dayjs(record?.endDate).format("YYYY-MM-DD")}
        </>
      ),
    },
  ];

  useEffect(() => {
    onListData();
  }, [currentPageNo]);

  return (
    <>
      {/* Search Area */}
      <div className="search-area">
        <Form form={form} onFinish={onListData}>
          <table
            style={{
              width: "80%",
            }}
          >
            <tbody>
              <tr>
                <th align="right">이름</th>
                <td width={100}>
                  <Form.Item name={"memberName"} noStyle>
                    <Input maxLength={30} allowClear />
                  </Form.Item>
                </td>
                <th align="right">전화번호</th>
                <td width={200}>
                  <Form.Item name={"memberPhone"} noStyle>
                    <Input maxLength={30} allowClear />
                  </Form.Item>
                </td>
                <th align="right">성별</th>
                <td>
                  <Form.Item name={"memberSex"} initialValue={""} noStyle>
                    <Select
                      options={[
                        { value: "", label: "전체" },
                        { value: "M", label: "남자" },
                        { value: "F", label: "여자" },
                      ]}
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                </td>
                <th align="right">활성화 여부</th>
                <td>
                  <Form.Item name={"activeYn"} initialValue={""} noStyle>
                    <Select
                      options={[
                        { value: "", label: "전체" },
                        { value: "Y", label: "활성화" },
                        { value: "N", label: "비활성화" },
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
        rowKey={(data: MemberVO) => data?.memberSeq ?? 0}
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

export default MemberList;
