import { Table, Typography, Badge, Form, Input, Select, Button } from "antd";
import { useState, useEffect } from "react";
import {
  API_VERSION,
  SERVER_API_URL,
  URLParams,
} from "../../../../../../../../utils/global";
import { useParams } from "next/navigation";
import { SearchOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { Key } from "antd/es/table/interface";
import type { ColumnsType } from "antd/es/table";
import { FETCH } from "../../../../../../../../lib/utils";

export interface ResponseJson {
  currentPageNo?: number;
  recordCountPerPage?: number;
  totalCnt?: number;
  list?: any;
}

type Props = {
  onSaveComplete?: (membershipSeq: number, membershipName: string) => void;
};

export default function PayMembershipList({ onSaveComplete }: Props) {
  const [listData, setListData] = useState<ResponseJson>({});
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();
  const company = params?.company;
  const [tableShowRows, setTableShowRows] = useState(10);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [form] = useForm();
  const [membershipSeq, setMembershipSeq] = useState<number>(0);
  const [membershipName, setMembershipName] = useState<string>("");

  // 회원권 목록 데이터 호출
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

  // 라디오 버튼 Change 이벤트
  const onSelectedRowKeysChange = (
    selectedRowKeys: Key[],
    selectedRow: any
  ) => {
    selectedRow?.map((rowData: any) => {
      setMembershipSeq(rowData?.membershipSeq);
      setMembershipName(rowData?.membershipName);
    });
  };

  // 선택 버튼
  const selectedMember = () => {
    if (listData?.totalCnt === 0 || membershipSeq === 0) {
      alert("선택된 회원이 없습니다.");
      return false;
    }

    if (!confirm("선택하시겠습니까?")) {
      return false;
    }
    onSaveComplete && onSaveComplete(membershipSeq, membershipName);
  };

  const columns: ColumnsType = [
    {
      title: "회원권 이름",
      align: "center",
      dataIndex: "membershipName",
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
              width: "100%",
            }}
          >
            <tbody>
              <tr>
                <th align="right">회원권 이름</th>
                <td>
                  <Form.Item name={"membershipName"} noStyle>
                    <Input maxLength={40} />
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
                {/* 조회 버튼 */}
                <td align="right">
                  <Button
                    type="primary"
                    htmlType={"submit"}
                    icon={<SearchOutlined />}
                  >
                    조회
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Form>
      </div>
      <div className="btn-area-list"></div>
      <Table
        dataSource={listData?.list}
        columns={columns}
        rowSelection={{ type: "radio", onChange: onSelectedRowKeysChange }}
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
      ></Table>
      {/* Bottom Button Area */}
      <div className="btn-area-detail">
        <Button type="primary" onClick={selectedMember}>
          선택
        </Button>
        <Button
          type="primary"
          onClick={() => {
            if (confirm("저장되지 않은 내용은 모두 삭제됩니다.")) {
              onSaveComplete && onSaveComplete(0, "");
            }
          }}
        >
          취소
        </Button>
      </div>
    </>
  );
}
