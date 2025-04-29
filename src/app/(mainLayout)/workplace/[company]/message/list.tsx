"use client";

import {
  Table,
  Tag,
  Button,
  Input,
  DatePicker,
  Select,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

const dataSource = [
  {
    key: "1",
    smType: "자동",
    smTitle: "회원비 납부 요청 메세지",
    smContent: "성명: #이름 청구내용: #년 #월분 청구일자: # 청구금액: # 원 ...",
    regDate: "2022-10-01",
  },
  {
    key: "2",
    smType: "수동",
    smTitle: "체육관 휴무 메세지",
    smContent: "안녕하세요. BB 복싱장입니다..",
    regDate: "2022-10-07",
  },
];

/**
 * 메시지 전송 목록
 * @returns MessageList
 */
const MessageList = () => {
  const router = useRouter();
  const params = useParams();
  const company = params?.company;
  const [listData, setListData] = useState<any>(dataSource);

  // 상세 화면 진입
  const onDetail = (seq: number) => {
    router.push(`/workplace/${company}/message/${seq}/detail`);
  };

  // 등록 화면 진입
  const onInsert = () => {
    router.push(`/workplace/${company}/message/0/insert`);
  };

  // 목록 데이터 호출
  const onListData = async () => {
    try {
      await fetch(``, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          setListData(res?.result);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {}
  };

  const columns = [
    {
      title: "전송 타입",
      dataIndex: "smType",
      render: (data: string) =>
        data === "자동" ? <Tag color="processing">자동</Tag> : <Tag>수동</Tag>,
    },
    {
      title: "제목",
      dataIndex: "smTitle",
      render: (data: string) => (
        <Typography.Link onClick={() => onDetail(1)}>{data}</Typography.Link>
      ),
    },
    {
      title: "전송 내용",
      dataIndex: "smContent",
    },
    {
      title: "등록 일자",
      dataIndex: "regDate",
    },
  ];

  return (
    <>
      {/* 조회 조건 */}
      <div className="search-area">
        <table
          style={{
            width: "100%",
          }}
        >
          <tbody>
            <tr>
              <th align="right">전송 타입</th>
              <td>
                <Select
                  defaultValue={""}
                  options={[
                    { value: "", label: "전체" },
                    { value: "A", label: "자동" },
                    { value: "N", label: "수동" },
                  ]}
                />
              </td>
              <th align="right">제목</th>
              <td width={"20%"}>
                <Input />
              </td>
              <th align="right">전송 내용</th>
              <td width={"20%"}>
                <Input />
              </td>
              <th align="right">등록 일자</th>
              <td>
                <DatePicker />
              </td>
              {/* 조회 버튼 */}
              <td align="right">
                <Button icon={<SearchOutlined />}>조회</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="btn-area-list">
        <Button type="primary" onClick={onInsert}>
          등록하기
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} />
    </>
  );
};

export default MessageList;
