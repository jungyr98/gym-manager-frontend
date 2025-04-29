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
import { FETCH } from "../../../../../../../../lib/utils";

export interface ResponseJson {
  currentPageNo?: number;
  recordCountPerPage?: number;
  totalCnt?: number;
  list?: any;
}

type Props = {
  onSaveComplete?: (memberSeq: number, memberName: string) => void;
};

export default function PayMemberList({ onSaveComplete }: Props) {
  const [listData, setListData] = useState<ResponseJson>({});
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();
  const company = params?.company;
  const [tableShowRows, setTableShowRows] = useState(10);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [form] = useForm();
  const [memberSeq, setMemberSeq] = useState<number>(0);
  const [memberName, setMemberName] = useState<string>("");

  // 회원 목록 데이터 호출
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
        .catch((e) => console.log(e))
        .finally(() => setLoading(false));
    } catch (error) {}
  };

  // 라디오 버튼 Change 이벤트
  const onSelectedRowKeysChange = (
    selectedRowKeys: Key[],
    selectedRow: any
  ) => {
    selectedRow?.map((rowData: any) => {
      setMemberSeq(rowData?.memberSeq);
      setMemberName(rowData?.memberName);
    });
  };

  // 선택 버튼
  const selectedMember = () => {
    if (listData?.totalCnt === 0 || memberSeq === 0) {
      alert("선택된 회원이 없습니다.");
      return false;
    }

    if (!confirm("선택하시겠습니까?")) {
      return false;
    }
    onSaveComplete && onSaveComplete(memberSeq, memberName);
  };

  const columns = [
    {
      title: "이름",
      dataIndex: "memberName",
    },
    {
      title: "생년월일",
      dataIndex: "memberBirth",
    },
    {
      title: "전화번호",
      dataIndex: "memberPhone",
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
      dataIndex: "membershipPeriod",
      render: (data: string) => (
        <>
          {data === undefined ? (
            "-"
          ) : (
            <>
              <Badge status="success" /> {data}
            </>
          )}
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
              width: "100%",
            }}
          >
            <tbody>
              <tr>
                <th align="right">이름</th>
                <td width={100}>
                  <Form.Item name={"memberName"} noStyle>
                    <Input />
                  </Form.Item>
                </td>
                <th align="right">전화번호</th>
                <td width={200}>
                  <Form.Item name={"memberPhone"} noStyle>
                    <Input />
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
        rowKey={(data: any) => data?.memberSeq}
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
