"use client";

import { useState } from "react";
import {
  Table,
  InputNumber,
  Button,
  Input,
  DatePicker,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";

const dataSource = [
  {
    key: "1",
    goodsName: "노바 복싱 글러브 8oz",
    goodsPrice: "30,000원",
    goodsQuantity: 20,
    regDate: "2022-10-01",
  },
  {
    key: "2",
    goodsName: "노바 핸드랩",
    goodsPrice: "10,000원",
    goodsQuantity: 30,
    regDate: "2022-10-01",
  },
];

/**
 * 재고 목록
 * @returns ItemList
 */
const ItemList = () => {
  const router = useRouter();
  const params = useParams();
  const company = params?.company;
  const [listData, setListData] = useState<any>(dataSource);

  // 상세 화면 진입
  const onDetail = (seq: number) => {
    router.push(`/workplace/${company}/item/${seq}/detail`);
  };

  // 등록 화면 진입
  const onInsert = () => {
    router.push(`/workplace/${company}/item/0/insert`);
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
      title: "제품명",
      dataIndex: "goodsName",
      render: (data: string) => (
        <Typography.Link onClick={() => onDetail(1)}>{data}</Typography.Link>
      ),
    },
    {
      title: "제품 가격",
      dataIndex: "goodsPrice",
    },
    {
      title: "제품 수량",
      dataIndex: "goodsQuantity",
      render: (data: number) => <InputNumber defaultValue={data} />,
    },
    {
      title: "등록일자",
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
              <th align="right">제품명</th>
              <td width={"30%"}>
                <Input />
              </td>
              <th align="right">등록일자</th>
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
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
        }}
      />
    </>
  );
};

export default ItemList;
